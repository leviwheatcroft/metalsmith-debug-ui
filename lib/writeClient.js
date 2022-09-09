const {
  join,
  resolve
} = require('path')
const {
  readdir,
  readFile
} = require('fs').promises
const { getData } = require('./data')

let written = false

/**
 * ## writeClient
 * writes html, styles, and js to build dir
 * @param {Object} files metalsmith files structure
 * @param {Metalsmith} metalsmith
 * @returns {Promise}
 */
async function writeClient (files, metalsmith) {
  const assetsPath = resolve(__dirname, '../', 'build', 'debug-ui')
  const clientFileNames = await readdir(assetsPath)
  const clientFiles = {}
  if (!written) {
    for await (const fileName of clientFileNames) {
      const readPath = join(assetsPath, fileName)
      const writePath = join('debug-ui', fileName)
      const contents = await readFile(readPath, { encoding: 'utf8' })
      clientFiles[writePath] = { contents }
    }
    written = true
  }
  clientFiles['debug-ui/snapshots.json'] = {
    contents: Buffer.from(JSON.stringify(getData()))
  }
  return new Promise((resolve, reject) => {
    try {
      metalsmith.write(clientFiles, resolve)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = writeClient
