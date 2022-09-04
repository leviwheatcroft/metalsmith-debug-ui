<template lang="pug">
.page-logs(
  class="flex flex-col min-h-screen"
)
  Nav
  .body(
    class="mt-16 mx-auto container"
  )
    .filter(
      class="flex flex-row justify-center gap-4"
    )
      label(
        for="filter"
        class="text-slate-400"
      ) Filter
      input(
        name="filter"
        class="w-64 border border-slate-400"
        v-model="filter"
      )
    table.log-items(
      class="border-separate border-spacing-x-2 my-8"
    )
      tr
        th(
          class="border-b-2 border-slate-400"
        ) Stamp
        th(
          class="border-b-2 border-slate-400"
        ) Dur.
        th(
          class="border-b-2 border-slate-400"
        ) Plugin
        th(
          class="p-l-8 border-b-2 border-slate-400"
        ) Message
      LogItem(
        v-for="({ elapsed, plugin, message, timestamp }, idx)  in filteredLogItems"
        :key="idx"
        :elapsed="elapsed"
        :plugin="plugin"
        :message="message"
        :timestamp="timestamp"
      )
  .spacer(
    class="flex-grow"
  )
  Footer
</template>
<script>
const { default: Nav } = require('./Nav')
const { default: Footer } = require('./Footer')
const { default: LogItem } = require('./LogItem')
const { state } = require('../store')

const PageLogs = {
  components: {
    Nav,
    Footer,
    LogItem
  },
  computed: {
    filteredLogItems () {
      if (!this.filter) return this.logItems
      const re = new RegExp(this.filter)
      return this.logItems.filter(({ message, plugin }) => re.test(message + plugin))
    }
  },
  data () {
    return {
      filter: '',
      state
    }
  },
  methods: {},
  props: {
    logItems: {
      required: true,
      type: Array
    }
  }
}

module.exports = PageLogs
</script>
<style lang="css" scoped></style>