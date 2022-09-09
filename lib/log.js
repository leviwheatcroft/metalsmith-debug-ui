const { format } = require('util')

let maskedLog = false
const output = {
  contents: Buffer.from('')
}

function captureLog (files, metalsmith) {
  if (metalsmith.debug.handle === log) return
  maskedLog = metalsmith.debug.handle
  metalsmith.debug.handle = log
  files['debug-ui/build.log'] = output
}

function log (...args) {
  output.contents = Buffer.concat([output.contents, Buffer.from(format(...args) + '\n')])
  maskedLog(...args)
}

module.exports = captureLog
