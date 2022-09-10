# Metalsmith Debug UI

Browser based debug interface for [metalsmith](https://metalsmith.io)

Provides nice ui to navigate metalsmith files and metadata, allowing you to view different stages in the build process

Features:

 * nice ui for exploring files, metadata & logs
 * can jump forwards and backwards through the build process
 * cool vue based client

## install

`yarn add metalsmith-debug-ui`

## usage
`metalsmith-debug-ui` clones your metalsmith files and metadata strutures at
different times during the build process and stores this history. Then it
injects a browser based client into your build output which allows you to view
that history.

Import the plugin and use it to create snapshots during the build process.

Note that logs will only be captured after the first snapshot.

```javascript
import Metalsmith from 'metalsmith'
import snapshot from 'metalsmith-debug-ui'

const metalsmith = Metalsmith('src')

metalsmith
  .use(snapshot())
  .use(myFirstPlugin({...}))
  .use(mySecondPlugin({...}))
  .use(snapshot())
  .use(myThirdPlugin({...}))
  .use(snapshot())
  .build(...)
```

There's a [working example here](./examples/basic).

## alternative usage
This plugin also exposes a method which will patch your metalsmith instance to do a snapshot after every plugin, without having to call the snapshot plugin each time. See [the example](./examples/patched).

This plugin also works fine with metalsmith's CLI mode. See [the example](./examples/cli).

## output
A client to view snapshots and logs will be written to `/debug-ui` in your build folder.

If you're using `browser-sync` or similar to serve your project at `http://localhost:3000` then the url will be `http://localhost:3000/debug-ui/index.html`.

## compatibility

`metalsmith@2.5.0` and newer is not compatible with `metalsmith-debug-ui@0.3.3`, upgrade
to `metalsmith-debug-ui@^1.0.0`.

## options

nil

## building

`yarn webpack`

or

`NODE_ENV=production yarn webpack`

## License

**MIT** : http://opensource.org/licenses/MIT
