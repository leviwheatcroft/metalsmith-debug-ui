import Metalsmith from 'metalsmith'
import markdown from '@metalsmith/markdown'
import layouts from '@metalsmith/layouts'
import permalinks from '@metalsmith/permalinks'
import collections from '@metalsmith/collections'
// import snapshot from 'metalsmith-debug-ui'
import snapshot from '../../lib/index.js'

const metalsmith = Metalsmith('./')

metalsmith.env('DEBUG', '*')

metalsmith
  .metadata({
    sitename: 'My Static Site & Blog',
    description: "It's about saying »Hello« to the World.",
    generator: 'Metalsmith',
    url: 'https://metalsmith.io/'
  })
  .source('./src')
  .destination('./build')
  .clean(true)
  .use(snapshot())
  .use(
    collections({
      posts: 'posts/*.md'
    })
  )
  .use(snapshot())
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
  .use(snapshot())
  .build(function (err, files) {
    if (err) throw err
  })
