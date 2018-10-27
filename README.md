# metalsmith-debug-ui

![nodei.co](https://nodei.co/npm/metalsmith-debug-ui.png?downloads=true&downloadRank=true&stars=true)

![npm](https://img.shields.io/npm/v/metalsmith-debug-ui.svg) ![github-issues](https://img.shields.io/github/issues/leviwheatcroft/metalsmith-debug-ui.svg) ![stars](https://img.shields.io/github/stars/leviwheatcroft/metalsmith-debug-ui.svg) ![forks](https://img.shields.io/github/forks/leviwheatcroft/metalsmith-debug-ui.svg)

Browser based debug interface for [metalsmith](https://metalsmith.io)

Provides nice ui to navigate metalsmith files and metadata, allowing you to view any stage of the build process

Features:

 * nice ui for exploring files & metadata
 * can jump forwards and backwards through the build process
 * cool react based client

![files interface][files]

See the [annotated source][annotated source] or [github repo][github repo]

## install

`npm i --save metalsmith-debug-ui`

## usage
`metalsmith-debug-ui` clones your metalsmith files and metadata strutures at
different times during the build process and stores this history. Then it
injects a browser based client into your build output which allows you to view
that history.

### patch mode
This will report after every plugin. You need to patch your metalsmith instance.

```javascript
import Metalsmith from 'metalsmith'
import { patch } from 'metalsmith-debug-ui'

let ms = Metalsmith('src')

patch(ms)

ms
.use(...)
.build(...)
```

### report mode

Just call `report` as a plugin

```javascript
import Metalsmith from 'metalsmith'
import { report } from 'metalsmith-debug-ui'

let ms = Metalsmith('src') // no need to patch

ms
.use(myFirstPlugin({...}))
.use(mySecondPlugin({...}))
.use(report('stage 1'))
.use(myFirstPlugin({...}))
.use(report('stage 2'))
.build(...)
```

### metalsmith CLI / metalsmith.json
This plugin won't work in metalsmith CLI mode.

### viewing output
The client should be built with the rest of your site, and will be located at `debug-ui/index.html` in your build directory. You should use your favourite static development server to view it in the same way you would view anything else in your build directory.

### errors during build
When a plugin throws an error metalsmith will just die as per normal behaviour, but the data debug-ui has collected will still be written to the build dir.

The only problem is that if you're using a dev server like `metalsmith-dev-server` you won't be able to view the ui to see what went wrong. I recommend implementing [browser-sync][browser-sync] or something instead.

### anonymous plugins
It's difficult to reliably detect the names of plugins in order to report them in the ui. debug-ui first tries to sniff the plugin name from a stack trace, if that fails it checks whether the plugin returns a named function, and if that fails it will simply list the plugin as `anonymous`.

In most cases this is satisfactory. If something is reported as anonymous you can easily work out what it is by looking at the plugins before and after it.

## demo
see [metalsmith-all-the-things][metalsmith-all-the-things] for a full working
demo.

## options
nil

## plugin compatibility
Some plugins may not write to the `debug-ui` log, although I haven't found any
yet. In theory any plugins using `debug v2.x.x` should work. If you find one
please post an issue.

## testing
nil.

## building
Deprecation warning re: parseQuery is from upstream package. Don't worry about
it.

`npm run watch`

## Author
Levi Wheatcroft <levi@wht.cr>

## Contributing
Contributions welcome; Please submit all pull requests against the master
branch.

## License
**MIT** : http://opensource.org/licenses/MIT

[annotated source]: https://leviwheatcroft.github.io/metalsmith-debug-ui "annotated source"
[github repo]: https://github.com/leviwheatcroft/metalsmith-debug-ui "github repo"
[files]: http://leviwheatcroft.github.io/metalsmith-debug-ui/images/files.png
[browser-sync]: https://www.browsersync.io/
[metalsmith-all-the-things]: https://github.com/leviwheatcroft/metalsmith-all-the-things
[anonymous vs named plugins]: https://github.com/leviwheatcroft/metalsmith-debug-ui/issues/2
[metalsmith-sugar]: https://github.com/connected-world-services/metalsmith-sugar
