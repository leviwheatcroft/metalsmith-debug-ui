<template lang="pug">
#app
  PageSnapshot(
    v-if="state.page === 'snapshots'",
    :snapshots="snapshots"
  )
  PageLogs(
    v-if="state.page === 'logs'"
    :log="log"
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
      log: '',
      snapshots: [{}]
    }
  },
  mounted () {
    const app = this
    fetch('/debug-ui/snapshots.json')
      .then((res) => {
        res.json()
          .then((snapshots) => {
            console.log(snapshots)
            app.snapshots = snapshots.snapshots
          })
      })
      .catch((err) => {
        console.error('Unable to fetch snapshots.')
        console.error(err)
        throw err
      })
    fetch('/debug-ui/build.log')
      .then((res) => {
          res.text()
            .then((log) => {
              console.log(log)
              app.log = log
            })
        })
        .catch((err) => {
          console.warn('build.log not available')
        })
  },
}

module.exports = App
</script>
<style lang="css" scoped></style>
