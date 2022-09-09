const writeClient = require('./writeClient')
const { pushSnapshot } = require('./data')
const captureLog = require('./log')

/**
 * ## snapshot
 * to be called as a metalsmith plugin clones current state of files & metadata
 * @param {String} name
 * @returns {Promise}
 */
function snapshot (fnName) {
  async function snapshot (files, metalsmith) {
    captureLog(files, metalsmith)
    if (!fnName) {
      const idx = metalsmith.plugins.indexOf(snapshot)
      if (idx === 0) fnName = 'initial'
      else fnName = metalsmith.plugins[idx - 1].name
    }
    pushSnapshot(fnName, files, metalsmith)
    await writeClient(files, metalsmith) // promise
  }
  return snapshot
}

/**
 * ## exports
 */
module.exports = snapshot
