const writeClient = require('./writeClient')
const { pushSnapshot } = require('./data')
const captureLog = require('./log')

/**
 * A metalsmith plugin for recording and rendering debug information.
 * @param  {String} fnName
 * @returns {import('metalsmith').Plugin}
 */
function snapshot (fnName) {
  async function snapshot (files, metalsmith) {
    captureLog(files, metalsmith)
    if (typeof fnName !== 'string' || fnName.length === 0) {
      const idx = metalsmith.plugins.indexOf(snapshot)
      if (idx === 0) fnName = 'initial'
      else fnName = metalsmith.plugins[idx - 1].name || 'anonymous'
    }
    pushSnapshot(fnName, files, metalsmith)
    await writeClient(files, metalsmith) // promise
  }
  return snapshot
}

module.exports = snapshot
