import socketIo from 'socket.io'
import http from 'http'
import vow from 'vow'
import wrap from 'wrap-fn'
import debug from 'debug'
import st from 'st'
import {
  resolve,
  separator,
  parse
} from 'path'
import transform from 'lodash.transform'
import set from 'lodash.set'
import stripAnsi from 'strip-ansi'

const dbg = debug('metalsmith-debug-ui')

let io
let paused
let data
let doAll = false
const defaults = {
  always: false,
  port: 8081
}

/**
 * ## log
 *
 * this log fn is stashed on metalsmith instance to allow other plugins to
 * write to this debug ui. It simply emits the args to the client then logs as
 * normal
 *
 * @param ...args accepts parameters in the same way `debug.log` does
 */
function log (...args) {
  if (io) io.sockets.emit('log', args.map(stripAnsi))
  maskedLog(...args)
}

// hook `debug.log`
const maskedLog = debug.log
debug.log = log

/**
 * ## patch
 *
 * this is the only exported function, to be used like:
 * ```
 * let metalsmith = new Metalsmith(__dirname)
 * patch(metalsmith)
 * ```
 * @param {object} metalsmith instance
 */
function patch (metalsmith, options) {
  // defaults
  options = Object.assign(defaults, options)
  if (
    (!options.always) &&
    (!process.argv.slice(1).find((value) => (value === '--debug-ui')))
  ) {
    dbg('enable debug-ui by calling with "--debug-ui" argument')
    return
  }
  // start server
  server(options.port || 8081)
  metalsmith._maskedBuild = metalsmith.build
  metalsmith.build = build
  metalsmith.log = log
}

/**
 * ## build
 * replaces metalsmith's build fn. simply prepends `pause` fn to each plugin
 *
 * @param ...args same args as metalsmith build
 */
function build (...args) {
  dbg('build called')
  const masked = []
  this.plugins.forEach((fn) => {
    masked.push((...args) => {
      // pass the original fn to pause, so that the client can report it's
      // `name` property (so plugins should return named functions)
      let defer = vow.defer()
      pause(...args, fn)
      .then(() => {
        // wrap here to support sync, async, and promises.. like metalsmith
        wrap(fn, defer.resolve.bind(defer))(...args.slice(0, 2))
      })
      return defer.promise()
    })
  })
  this.plugins = masked
  // run metalsmith's original build
  this._maskedBuild(...args)
}

/**
 * ## pause
 * run before every plugin, pass data to ui, wait for user action.
 *
 * @param {object} files list of files
 * @param {object} metalsmith instance
 */
function pause (files, metalsmith) {
  let next = arguments[arguments.length - 1].name
  // name of bound function is 'bound functionName', get rid of that prefix
  next = next ? next.replace(/bound /, '') : 'anonymous'

  data = {
    // use fn.name to give user some idea where we're up to
    next,
    // convert files structure to directory tree
    files: tree(files),
    // normal metalsmith metadata
    metadata: metalsmith.metadata()
  }
  // prepare data for presentation
  data = mutate(data)
  if (doAll) return vow.resolve()
  dbg(`waiting (next: ${data.next})`)
  io.sockets.emit('plugin', data)
  // store deferred globally
  paused = vow.defer()
  return paused.promise()
}

/**
 * ## tree fn
 * convert files structure to directory tree
 *
 * @param {object} files metalsmith files structure
 */
function tree (files) {
  return transform(
    files,
    function (result, val, key) {
      let path = parse(key)
      path = [
        path.dir ? path.dir.replace(separator, '.') : '',
        `['${path.base}']`
      ].join('')
      set(result, path, val)
    },
    {}
  )
}

/**
 * ## mutate
 * recursable fn to apply mutators to object values
 * used to prepare object for presentation
 *
 * @param {object} obj target
 */
function mutate (obj) {
  return transform(
    obj,
    function (result, val, key) {
      mutators.some((parser) => {
        result[key] = parser(val, key)
        return result[key]
      })
      if (result[key] === undefined) result[key] = val
    },
    {}
  )
}

/**
 * ## mutators
 * array of fns to apply to object values, will not continue after truthy value
 * is returned.
 */
const mutators = [
  (val, key) => {
    if (key === 'contents') return '...'
  },
  (val, key) => {
    if (Buffer.isBuffer(val)) return val.toString()
  },
  (val, key) => {
    if (val instanceof Object) return mutate(val)
  }
]

/**
 * ## server
 * a simple static server to serve the ui, and attach to `socket.io`
 */
function server (port) {
  const mount = st({
    path: resolve(__dirname, 'client'),
    index: 'index.html'
  })
  const app = http.createServer(function (req, res) {
    if (mount(req, res)) return
  })
  io = socketIo(app)

  app.listen(port, () => dbg(`listening on ${port}`))

  io.on('connection', function (socket) {
    socket.emit('plugin', data)
    socket.on('doNext', function () {
      paused.resolve()
    })
    socket.on('doAll', function () {
      doAll = true
    })
  })
}

/**
 * ## exports
 */
export default patch
export { patch }
