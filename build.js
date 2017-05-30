import Metalsmith from 'metalsmith'
import debug from 'debug'
import less from 'metalsmith-less'
import ignore from 'metalsmith-ignore'
import inPlace from 'metalsmith-in-place'
import webpack from 'metalsmith-webpack'
import move from 'metalsmith-move'

const dbg = debug('metalsmith-debug-ui')

/**
 * ## Metalsmith build
 * simple ms procedure to build the client
 */
Metalsmith('./')
.source('lib/client')
.destination('dist/client')
.use(webpack())
.use(move({
  '**/*.jsx': false
}))
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
