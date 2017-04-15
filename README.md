# metalsmith-debug-ui

![nodei.co](https://nodei.co/npm/metalsmith-debug-ui.png?downloads=true&downloadRank=true&stars=true)

![npm](https://img.shields.io/npm/v/metalsmith-debug-ui.svg)

![github-issues](https://img.shields.io/github/issues/leviwheatcroft/metalsmith-debug-ui.svg)

![stars](https://img.shields.io/github/stars/leviwheatcroft/metalsmith-debug-ui.svg)

![forks](https://img.shields.io/github/forks/leviwheatcroft/metalsmith-debug-ui.svg)

Browser based debug interface for [metalsmith](https://metalsmith.io)

Pauses build process after each plugin and allows you to explore files structure
and metadata before continuing.

Features:

 * nice ui for exploring files & metadata
 * cli control with `--debug-ui` arg
 * cool react & socket.io based client

See the [annotated source][1] or [github repo][2]

## install

`npm i --save metalsmith-debug-ui`

## usage

Because this plugin needs to mutate the metalsmith instance, it can't be called
as a regular plugin, you need to patch the metalsmith instance as shown.

```javascript
import Metalsmith from 'metalsmith'
import debugUi from 'metalsmith-debug-ui'

let ms = Metalsmith('src')
debugUi(ms, { always: true, port: 5050 })

ms
.use(...)
.build(...)
```

To initiate debug-ui you need to pass command line arg `--debug-ui`, or pass
the option `always: true`.

## options

*always*: {Boolean} (Default: false) if true, debug-ui will run without
`--debug-ui` command line arg.
*port*: {Number} (Default: 8081) http port

## plugin compatibility
Far as I'm aware all plugins will work when using debug ui.

However plugins need to explicitly use debug-ui's log function wrapper in order
for their debug output to show up in debug-ui, and most plugins don't do that
at this time. The example below show's how to do that.

In addition, debug-ui can only identify plugins which export a named function
as the plugin. The example shows that too.

```javascript
// metalsmith-witty-quote-generator
import debug from 'debug'

// start debugging as normal
const dbg = debug('witty-quote-generator')

export default function (options) {
  // use named function here
  return function wittyQuoteGenerator(files, metalsmith, done) {
    // patch debug.log like this
    debug.log = metalsmith.log || debug.log
    // ... your plugin logic
  }
}
```

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

 - **MIT** : http://opensource.org/licenses/MIT

[1]: https://leviwheatcroft.github.io/metalsmith-debug-ui "annotated source"
[2]:
