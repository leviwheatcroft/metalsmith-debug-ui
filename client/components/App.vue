<template lang="pug">
#app
  PageSnapshot(
    v-if="state.page === 'snapshots'",
    :plugins="snapshots.plugins"
  )
  PageLogs(
    v-if="state.page === 'logs'"
    :logItems="snapshots.log"
  )

</template>
<script>
const { default: PageSnapshot } = require('./PageSnapshot')
const { default: PageLogs } = require('./PageLogs')
const {state } = require('../store')

const App = {
  components: {
    PageSnapshot,
    PageLogs
  },
  data () {
    return {
      state,
      snapshots: {
        log: [],
        plugins: []
      }
    }
  },
  async mounted () {
    const response = await fetch('/debug-ui/snapshots.json')
    const snapshots = await response.json()
    console.log(snapshots)
    this.snapshots = snapshots
  },
}

module.exports = App
</script>
<style lang="css" scoped></style>
