const vow = require('vow')
const wrap = require('wrap-fn')
const debug = require('debug')
const {
  sep,
  parse,
  join
} = require('path')
const {
  readdir,
  readFile
} = require('fs')
const transform = require('lodash.transform')
const set = require('lodash.set')
const stripAnsi = require('strip-ansi')
const util = require('util')

// used for debug messages
const dbg = debug('metalsmith-debug-ui')

// stores cloned data & log until written to client
const data = {
  log: [],
  plugins: []
}

// whether client html, styles & js has already been written to build dir
let clientWritten = false

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
  return metalsmith
}

/**
 * ## report
 * to be called as a metalsmith plugin clones current state of files & metadata
 * @param {String} name
 * @returns {Promise}
 */
function report (fnName) {
  return function (files, metalsmith) {
    pushData(fnName, files, metalsmith)
    writeData(files, metalsmith)
    return writeClient(files, metalsmith) // promise
  }
}

/**
 * ## clear
 * clears data structure
 * useful for plugins that manage the build process like
 * `metalsmith-browser-sync` see issue #4
 */
function clear () {
  data.log = []
  data.plugins = []
}

/**
 * ## build
 * masks metalsmith's build fn. Once patched, calling build will wrap all
 * plugins with the debug-ui recorder, before calling the original build fn.
 *
 * @param ...args same args as metalsmith build
 */
function build (callback) {
  // `masked` will become the new plugin array
  const masked = []
  // before running any plugins, write the client to the build dir
  masked.push(writeClient)
  // wrap all existing plugins to capture data
  this.plugins.forEach((fn) => {
    masked.push((files, metalsmith) => {
      let fnName
      return vow.resolve()
      .then(() => {
        let defer = vow.defer()
        // wrap here to support sync, async, and promises.. like metalsmith
        // this also traps exceptions
        let wrapped = wrap(fn, (err) => {
          // we need to try to sniff the plugin name here, because it's likely
          // in the stack
          // console.log(new Error().stack)

          // regex to match a string like `/metalsmith-layouts/`
          let regex = /\/metalsmith-((?!debug-ui)[\w-]*)[/.](?!.*metalsmith-)/m
          // apply to a stack trace (non-standard)
          let match = regex.exec(new Error().stack)
          if (match) fnName = match[1]
          // if that didn't work, try for a named function
          else if (fn.name) fnName = fn.name.replace(/bound /, '')
          // fall back to anonymous :(
          else fnName = 'anonymous'
          if (err) defer.reject(err)
          else defer.resolve()
        })
        wrapped(files, metalsmith)
        return defer.promise()
      })
      .then(() => pushData(fnName, files, metalsmith))
      .catch((err) => {
        return writeData(files, metalsmith)
        .then(() => { throw err })
      })
    })
  })
  // after all plugins have run, write data to build dir
  masked.push(writeData)

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
function pushData (fnName, files, metalsmith) {
  data.plugins.push({
    // use fn.name to give user some idea where we're up to
    // name of bound function is 'bound functionName'
    fnName,
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
function writeData (files, metalsmith) {
  dbg('writing data to build')
  let defer = vow.defer()
  let dataJson = {
    'debug-ui/data.json': {
      contents: Buffer.from(JSON.stringify(data))
    }
  }
  // write the history data, no need for async
  metalsmith.write(dataJson, defer.resolve.bind(defer))
  return defer.promise()
}

/**
 * ## writeClient
 * writes html, styles, and js to build dir
 * @param {Object} files metalsmith files structure
 * @param {Metalsmith} metalsmith
 * @returns {Promise}
 */
function writeClient (files, metalsmith) {
  if (clientWritten) return vow.resolve()
  clientWritten = true
  const defer = vow.defer()
  // scrape the client dir and inject into files
  readdir(join(__dirname, 'client'), (err, children) => {
    if (err) throw new Error(err)
    const workers = []
    const client = []
    children.forEach((child) => {
      dbg(join(__dirname, 'client', child))

      let worker = readFilePromise(join(__dirname, 'client', child))
      .then((contents) => {
        dbg(join('debug-ui', child))
        client[join('debug-ui', child)] = { contents }
      })
      workers.push(worker)
    })
    vow.all(workers)
    .then(() => {
      metalsmith.write(client, defer.resolve.bind(defer))
    })
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
module.exports = { patch, report, clear }
