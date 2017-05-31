import vow from 'vow'
import wrap from 'wrap-fn'
import debug from 'debug'
import {
  sep,
  parse,
  join
} from 'path'
import {
  readdir,
  readFile
} from 'fs'
import transform from 'lodash.transform'
import set from 'lodash.set'
import stripAnsi from 'strip-ansi'
import util from 'util'

const dbg = debug('metalsmith-debug-ui')

const data = {
  log: [],
  plugins: []
}
let clientInjected = false
let isPatched = false

/**
 * ## log
 * this log fn is stashed on metalsmith instance to allow other plugins to
 * write to this debug ui.
 * @param ...args accepts parameters in the same way `debug.log` does
 */
function log (...args) {
  let clean = util.format.apply(util, args.map(stripAnsi))
  let entry = /^\s*([^\s]*)\s(.*)\s([^\s]*)$/.exec(clean)
  data.log.push({
    timestamp: new Date().toISOString().slice(11, -1),
    plugin: entry ? entry[1] : '',
    message: entry ? entry[2] : clean, // fallback failed regex
    elapsed: entry ? entry[3] : ''
  })
  // write to console as normal, breaks a lot of debug configuration but w/e
  process.stdout.write(util.format.apply(util, args) + '\n')
}

// hook `debug.log`
debug.log = log

/**
 * ## patch
 * patches `metalsmith.build`, when `build` is called it will wrap all plugins
 * with reporter.
 * ```
 * let metalsmith = new Metalsmith(__dirname)
 * patch(metalsmith)
 * ```
 * @param {object} metalsmith instance
 */
function patch (metalsmith, options) {
  dbg('patched build fn')
  metalsmith._maskedBuild = metalsmith.build
  metalsmith.build = build
  metalsmith.log = log
  isPatched = true
  return metalsmith
}

/**
 * ## plugin
 * to be called as a metalsmith plugin clones current state of files & metadata
 * @param {String} name
 * @returns {Promise}
 */
function report (name) {
  return (files, metalsmith) => {
    pushData(files, metalsmith, name)
    // if build is not patched we do this each time data is updated
    if (!isPatched) injectData(files)
    return injectClient(files) // promise
  }
}

/**
 * ## build
 * masks metalsmith's build fn. Once patched, calling build will wrap all
 * plugins with the debug-ui recorder, before calling the original build fn.
 *
 * @param ...args same args as metalsmith build
 */
function build (callback) {
  dbg('build called')
  const masked = []
  this.plugins.forEach((fn) => {
    masked.push((files, metalsmith) => {
      return vow.resolve()
      .then(() => {
        let defer = vow.defer()
        // wrap here to support sync, async, and promises.. like metalsmith
        wrap(fn, defer.resolve.bind(defer))(files, metalsmith)
        return defer.promise()
      })
      .then(() => report(fn.name)(files, metalsmith))
    })
  })
  masked.push((files) => {
    // if build is patched we do this once at the end (here)
    injectData(files)
  })
  this.plugins = masked
  // run metalsmith's original build
  this._maskedBuild(callback)
}

/**
 * ## pushData
 * clones current files & meta into store
 * @param {Object} files metalsmith files structure
 * @param {Metalsmith} metalsmith instance
 * @param {String} name descriptor for ui, usually plugin fn name
 */
function pushData (files, metalsmith, name) {
  data.plugins.push({
    // use fn.name to give user some idea where we're up to
    // name of bound function is 'bound functionName'
    fnName: (name || 'anonymous').replace(/bound /, ''),
    // convert files structure to directory tree
    files: tree(render(files)),
    // normal metalsmith metadata
    metadata: render(metalsmith.metadata())
  })
}

/**
 * ## injectData
 * writes `data.json` to metalsmith files structure
 * @param {Object} files metalsmith files structure
 */
function injectData (files) {
  dbg('writing data to build')
  // write the history data, no need for async
  files['debug-ui/data.json'] = {
    contents: Buffer.from(JSON.stringify(data))
  }
}

/**
 * ## injectClient
 * writes html, styles, and js to metalsmith files structure, ready to be built
 * by metalsmith
 * @param {Object} files metalsmith files structure
 * @returns {Promise}
 */
function injectClient (files) {
  if (clientInjected) return vow.resolve()
  clientInjected = true
  const defer = vow.defer()
  // scrape the client dir and inject into files
  readdir(join(__dirname, 'client'), (err, children) => {
    if (err) throw new Error(err)
    const workers = []
    children.forEach((child) => {
      dbg(join(__dirname, 'client', child))

      let worker = readFilePromise(join(__dirname, 'client', child))
      .then((contents) => {
        dbg(join('debug-ui', child))
        files[join('debug-ui', child)] = { contents }
      })
      workers.push(worker)
    })
    vow.all(workers)
    .then(defer.resolve.bind(defer))
    .catch(defer.reject.bind(defer))
  })
  return defer.promise()
}

/**
 * ## readFilePromise
 * promisify readFile
 * @param {String} path
 * @returns {Promise<Buffer>}
 */
function readFilePromise (path) {
  const defer = vow.defer()
  readFile(path, (err, contents) => {
    if (err) return defer.reject(err)
    defer.resolve(contents)
  })
  return defer.promise()
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
      let path = parse(key)
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
  let copy = {}
  // store seen objects so we can avoid re-printing them
  let list = [ obj ]
  // store paths so we can assign converted values to the right path
  let paths = [['root']]
  for (let idx = 0; idx < list.length; idx++) {
    let item = list[idx]
    Object.keys(item).forEach((key) => {
      // store path of current item
      let path = paths[idx].concat([key])
      if (key === 'contents') {
        return set(copy, path, '...')
      }
      if (Buffer.isBuffer(item[key])) {
        return set(copy, path, item[key].toString())
      }
      // check if this item has been rendered already
      let copyIdx = list.indexOf(item[key])
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

/**
 * ## exports
 */
export default patch
export { patch, report }
