const snapshot = require('./index')()

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
function patch (metalsmith) {
  const _build = metalsmith.build
  metalsmith.build = function build (callback) {
    this.plugins = this.plugins
      .map((plugin) => [snapshot, plugin])
      .concat(snapshot)
      .flat()
    _build.apply(metalsmith, callback)
  }
  return metalsmith
}

/**
 * ## build
 * masks metalsmith's build fn. Once patched, calling build will wrap all
 * plugins with the debug-ui recorder, before calling the original build fn.
 *
 * @param ...args same args as metalsmith build
 */

// function build (callback) {
//   this.plugins = this.plugins.map((fn) => {
//     return async (files, metalsmith) => {
//       const fnName = fn.name || 'anonymous'
//       let resolve
//       let reject
//       const deferred = new Promise((_resolve, _reject) => {
//         resolve = _resolve
//         reject = _reject
//       })
//         .then(() => pushData(fnName, files, metalsmith))
//         .catch(async (err) => {
//           await writeClient(files, metalsmith)
//           throw err
//         })

//       if (typeof fn.then === 'function') {
//         // promise type plugins
//         try {
//           await fn(files, metalsmith)
//           resolve()
//         } catch (err) {
//           reject(err)
//         }
//       } else if (fn.length === 3) {
//         // done type plugins
//         fn(files, metalsmith, (err) => {
//           if (!err) return resolve()
//           reject(err)
//         })
//       } else {
//         // sync plugins
//         try {
//           fn(files, metalsmith)
//           resolve()
//         } catch (err) {
//           reject()
//         }
//       }
//       await deferred
//     }
//   })

//   this._maskedBuild(callback)
// }

/**
 * ## exports
 */
module.exports = patch
