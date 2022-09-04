const state = {
  page: 'snapshots',
  selectedSnapshot: 0
}

function setState (path, value) {
  state[path] = value
}

module.exports = { state, setState }
