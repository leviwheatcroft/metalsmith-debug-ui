const debug = require('debug')
const {
  sep,
  parse,
  join
} = require('path')
const {
  readdir,
  readFile
} = require('fs').promises
const transform = require('lodash/transform')
const set = require('lodash/set')
const stripAnsi = require('strip-ansi')
const util = require('util')

// used for debug messages
const dbg = debug('metalsmith-debug-ui')

// stores cloned data & log until written to client
const data = {
  log: [],
  plugins: []
}

function hookLogger (metalsmith) {
  const maskedLog = metalsmith.debug.handle

  function log (...args) {
    const clean = util.format.apply(util, args.map(stripAnsi))
    const entry = /^\s*([^\s]*)\s(.*)\s([^\s]*)$/s.exec(clean)
    data.log.push({
      timestamp: new Date().toISOString().slice(11, -1),
      plugin: entry ? entry[1] : '',
      message: entry ? entry[2] : clean, // fallback failed regex
      elapsed: entry ? entry[3] : ''
    })
    maskedLog.apply(metalsmith.debug, args)
  }
  metalsmith.debug.handle = log
}

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
  return metalsmith
}

// function plugin () {
//   return async function debugUi (files, metalsmith) {
//     dbg('patching plugins')
//     metalsmith.plugins.forEach((plugin, idx, plugins) => {
//       console.log(plugins.length)
//       plugins[idx] = async (files, metalsmith) => {
//         const pluginName = plugin.name || 'anonymous'
//         let resolve
//         let reject
//         const deferred = new Promise((_resolve, _reject) => {
//           resolve = _resolve
//           reject = _reject
//         })
//           .then(() => pushData(pluginName, files, metalsmith))
//           .catch(async (err) => {
//             await writeClient(files, metalsmith)
//             throw err
//           })
//         console.log(`running patched ${pluginName}`)
//         if (typeof plugin.then === 'function') {
//           // promise type plugins
//           try {
//             await plugin(files, metalsmith)
//             resolve()
//           } catch (err) {
//             reject(err)
//           }
//         } else if (plugin.length === 3) {
//           // done type plugins
//           plugin(files, metalsmith, (err) => {
//             if (!err) return resolve()
//             reject(err)
//           })
//         } else {
//           // sync plugins
//           try {
//             plugin(files, metalsmith)
//             resolve()
//           } catch (err) {
//             reject()
//           }
//         }
//         await deferred
//       }
//     })
//     metalsmith.plugins.push(async function writeClient (files, metalsmith) {
//       await writeClient(files, metalsmith)
//     })
//   }
// }

/**
 * ## report
 * to be called as a metalsmith plugin clones current state of files & metadata
 * @param {String} name
 * @returns {Promise}
 */
function report (fnName) {
  return function (files, metalsmith) {
    pushData(fnName, files, metalsmith)
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
  hookLogger(this)

  // `masked` will become the new plugin array
  const masked = []
  // wrap all existing plugins to capture data
  this.plugins.forEach((fn) => {
    masked.push(async (files, metalsmith) => {
      const fnName = fn.name || 'anonymous'
      let resolve
      let reject
      const deferred = new Promise((_resolve, _reject) => {
        resolve = _resolve
        reject = _reject
      })
        .then(() => pushData(fnName, files, metalsmith))
        .catch(async (err) => {
          await writeClient(files, metalsmith)
          throw err
        })

      if (typeof fn.then === 'function') {
        // promise type plugins
        try {
          await fn(files, metalsmith)
          resolve()
        } catch (err) {
          reject(err)
        }
      } else if (fn.length === 3) {
        // done type plugins
        fn(files, metalsmith, (err) => {
          if (!err) return resolve()
          reject(err)
        })
      } else {
        // sync plugins
        try {
          fn(files, metalsmith)
          resolve()
        } catch (err) {
          reject()
        }
      }
      await deferred
    })
  })
  // after all plugins have run, write data to build dir
  masked.push(writeClient)

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
 * ## writeClient
 * writes html, styles, and js to build dir
 * @param {Object} files metalsmith files structure
 * @param {Metalsmith} metalsmith
 * @returns {Promise}
 */
async function writeClient (files, metalsmith) {
  const clientFileNames = await readdir(join(__dirname, 'build'))
  const clientFiles = {}
  for await (const fileName of clientFileNames) {
    const readPath = join(__dirname, 'build', fileName)
    const writePath = join('debug-ui', fileName)
    const contents = await readFile(readPath, { encoding: 'utf8' })
    clientFiles[writePath] = { contents }
  }
  clientFiles['debug-ui/snapshots.json'] = {
    contents: Buffer.from(JSON.stringify(data))
  }
  return new Promise((resolve, reject) => {
    try {
      metalsmith.write(clientFiles, resolve)
    } catch (err) {
      reject(err)
    }
  })
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

/**
 * ## exports
 */
module.exports = { patch, report, clear }
