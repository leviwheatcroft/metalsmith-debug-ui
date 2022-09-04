const browserSync = require('browser-sync')

browserSync.create()
  .init({
    open: false,
    server: {
      baseDir: 'build',
      index: 'index.html',
      serveStaticOptions: {
        extensions: ['html']
      }
    },
    watch: true
  })
