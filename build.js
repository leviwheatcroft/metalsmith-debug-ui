import Metalsmith from 'metalsmith'
import debug from 'debug'
import less from 'metalsmith-less'
import ignore from 'metalsmith-ignore'
import inPlace from 'metalsmith-in-place'
import webpack from 'metalsmith-webpack-2'

const dbg = debug('metalsmith-debug-ui')

/**
 * ## Metalsmith build
 * simple ms procedure to build the client
 */
Metalsmith('./')
.source('lib/client')
.destination('dist/client')
.use(webpack())
.use(less({
  pattern: 'styles.less'
}))
.use(ignore([
  '**/*.jsx',
  'styles.less'
]))
.use(inPlace())
.build((err) => {
  if (err) dbg(err)
  else dbg('done')
})
