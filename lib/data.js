const transform = require('lodash/transform')
const {
  sep,
  parse
} = require('path')

const set = require('lodash/set')

const data = {
  snapshots: []
}

/**
 * Add current snapshot of files and meta to data structure
 * @param  {String} fnName identifier for most recent plugin
 * @param  {Object} files metalsmith files structure
 * @param  {Object} metalsmith metalsmith meta structure
 * @returns null
 */
function pushSnapshot (fnName, files, metalsmith) {
  data.snapshots.push({
    fnName,
    files: tree(render(files)),
    metadata: render(metalsmith.metadata())
  })
}

/**
 * Expose data structure
 * @returns {Object}
 */
function getData () {
  return data
}

/**
 * Convert files structure to directory tree
 * @param {Object} files metalsmith files structure
 * @return {Object}
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
 * Parse an object, convert values to something renderable, and avoid multiple copies of
 * the same object (recursion, cyclic references, or just copies)
 * @param {Object} obj target, files or metadata
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
