const snapshot = require('./index')

/**
 * patches metalsmith.build, when build is called it will wrap all plugins with
 * snapshots.
 * with reporter.
 * ```
 * let metalsmith = new Metalsmith(__dirname)
 * patch(metalsmith)
 * ```
 * @param {Object} metalsmith instance
 * @returns {Object}
 */
function patch (metalsmith) {
  const _build = metalsmith.build
  metalsmith.build = function build (callback) {
    this.plugins = this.plugins
      .map((plugin) => [snapshot(), plugin])
      .concat(snapshot())
      .flat()
    _build.apply(metalsmith, callback)
  }
  return metalsmith
}

module.exports = patch
