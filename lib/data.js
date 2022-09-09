const transform = require('lodash/transform')
const {
  sep,
  parse
} = require('path')

const set = require('lodash/set')

const data = {
  snapshots: []
}

function pushSnapshot (fnName, files, metalsmith) {
  data.snapshots.push({
    // use fn.name to give user some idea where we're up to
    // name of bound function is 'bound functionName'
    fnName,
    // convert files structure to directory tree
    files: tree(render(files)),
    // normal metalsmith metadata
    metadata: render(metalsmith.metadata())
  })
}

function getData () {
  return data
}

/**
 * ## tree fn
 * convert files structure to directory tree
 *
 * @param {object} files metalsmith files structure
 */
function tree (files) {
  return transform(
    files,
    function (result, val, key) {
      const path = parse(key)
      if (path.dir) {
        set(result, path.dir.split(sep).concat(path.base), val)
      } else {
        set(result, path.base, val)
      }
    },
    {}
  )
}

/**
 * ## render
 * Really rad fn to parse an object, convert values to something renderable,
 * and avoid multiple copies of the same object (recursion, cyclic references,
 * or just copies)
 *
 * @param {object} obj target, files or metadata
 */
function render (obj) {
  // use copy so we don't mutate files
  const copy = {}
  // store seen objects so we can avoid re-printing them
  const list = [obj]
  // store paths so we can assign converted values to the right path
  const paths = [['root']]
  for (let idx = 0; idx < list.length; idx++) {
    const item = list[idx]
    Object.keys(item).forEach((key) => {
      // store path of current item
      const path = paths[idx].concat([key])
      if (key === 'contents') {
        return set(copy, path, '...')
      }
      if (Buffer.isBuffer(item[key])) {
        return set(copy, path, item[key].toString())
      }
      // check if this item has been rendered already
      const copyIdx = list.indexOf(item[key])
      if (~copyIdx) {
        return set(copy, path, `[Copy: ${paths[copyIdx].join(' > ')}]`)
      }
      // store objects so we can assess them next loop
      if (item[key] instanceof Object) {
        list.push(item[key])
        paths.push(path)
        return
      }
      // if none ofthe above apply, just stash the value
      set(copy, path, item[key])
    })
  }
  return copy.root
}

module.exports = {
  pushSnapshot,
  getData
}
