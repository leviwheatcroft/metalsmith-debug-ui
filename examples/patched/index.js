import Metalsmith from 'metalsmith'
import markdown from '@metalsmith/markdown'
import layouts from '@metalsmith/layouts'
import permalinks from '@metalsmith/permalinks'
import collections from '@metalsmith/collections'
// import snapshot from 'metalsmith-debug-ui'
import debugUiPatch from '../../lib/patch.js'

const metalsmith = Metalsmith('./')

const debugUiMetalsmith = debugUiPatch(metalsmith)

debugUiMetalsmith.env('DEBUG', '*')

debugUiMetalsmith
  .metadata({
    sitename: 'My Static Site & Blog',
    description: "It's about saying »Hello« to the World.",
    generator: 'Metalsmith',
    url: 'https://metalsmith.io/'
  })
  .source('./src')
  .destination('./build')
  .clean(true)
  .use(
    collections({
      posts: 'posts/*.md'
    })
  )
  .use(markdown())
  .use(permalinks())
  .use(
    layouts({
      engineOptions: {
        helpers: {
          formattedDate: function (date) {
            return new Date(date).toLocaleDateString()
          }
        }
      }
    })
  )
  .build(function (err, files) {
    if (err) throw err
  })
