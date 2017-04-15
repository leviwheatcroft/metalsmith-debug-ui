import Metalsmith from 'metalsmith'
import debug from 'debug'
import {
  resolve
} from 'path'
import less from 'metalsmith-less'
import ignore from 'metalsmith-ignore'
import inPlace from 'metalsmith-in-place'

const dbg = debug('metalsmith-debug-ui')
const baseDir = resolve(__dirname, '..')

/**
 * ## Metalsmith build
 * simple ms procedure to build the client
 * I couldn't get webpack to work here so I'm doing that externally.
 */
Metalsmith(baseDir)
.source(resolve(baseDir, 'lib', 'client'))
.destination(resolve(baseDir, 'dist', 'client'))
.use(less({
  pattern: 'styles.less'
}))
.use(ignore([
  'styles.less'
]))
.use(inPlace())
.build((err) => {
  if (err) dbg(err)
  else dbg('done')
})
