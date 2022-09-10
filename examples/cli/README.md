## basic example

### build metalsmith-debug-ui

```
git clone git@github.com:leviwheatcroft/metalsmith-debug-ui.git
cd metalsmith-debug-ui
yarn
yarn webpack
```

### run example

```
cd examples/cli
yarn
yarn start
yarn serve
```

### plugins array

Note that in this example the plugin is called via it's internal reference like:

```
  "plugins": [
    { "../../lib/index.js": {} },
    { "@metalsmith/collections": { "posts": "posts/*.md" } }
  ]
```

This is just to ensure that when run in this repo metalsmith will always use the current checked out version of the plugin.

When using the plugin yourself `metalsmith.json` it would look more like this:

```
{
  "metadata": {
    "sitename": "My Static Site & Blog",
    "description": "It's about saying »Hello« to the World.",
    "generator": "Metalsmith",
    "url": "https://metalsmith.io/"
  },
  "plugins": [
    { "metalsmith-debug-ui": {} },
    { "@metalsmith/collections": { "posts": "posts/*.md" } },
    { "metalsmith-debug-ui": {} },
    { "@metalsmith/markdown": {} },
    { "@metalsmith/permalinks": {} },
    { "@metalsmith/layouts": {} },
    { "metalsmith-debug-ui": {} }
  ]
}
```
