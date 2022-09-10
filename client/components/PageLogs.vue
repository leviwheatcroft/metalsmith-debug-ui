<template lang="pug">
.page-logs(
  class="flex flex-col min-h-screen"
)
  Nav
  .body(
    v-if="!logItems.length"
    class="mt-16 mx-auto container"
  )
    .no-logs(
      class="mx-auto w-60"
    )
      h1(
        class="text-2xl"
      ) Oof. No logs!
      div
        p(
          class="mt-4"
        )
          | Metalsmith doesn't seem to be generating any logs?!
        p(
          class="mt-4"
        )
          | You might need to set the environment variable:
        p(
          class="mt-4"
        )
          pre
            | metalsmith.env('DEBUG', '*')

  .body(
    v-if="logItems.length"
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
      class="mx-auto my-8"
    )
      tr
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
        v-for="({ elapsed, plugin, message, timestamp }, idx)  in logItems"
        :key="idx"
        :elapsed="elapsed"
        :plugin="plugin"
        :message="message"
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
    chunks () {
      const ansiEscapeRe = /\u001B\[\d{1,3};\d{1,3};\d{1,3}(?:;\d{1,3})?m|\u001B\[0m/
      return this.log
        .split(ansiEscapeRe)
        .filter((i) => /\S/.test(i))
        .map((i) => i.trim())
    },
    logItems () {
      const logItems = []
      const chunks = this.chunks
      for (let i = 0; i < chunks.length; i += 3) {
        const plugin = chunks[i]
        const message = chunks[i + 1]
        const elapsed = chunks[i + 2]
        if (this.filter) {
          const filterRe = new RegExp(this.filter)
          if (
            !filterRe.test(plugin) &&
            !filterRe.test(message)
          ) continue
        }
        logItems.push({
          plugin,
          message,
          elapsed
        })
      }

      return logItems
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
    log: {
      required: true,
      type: String
    }
  }
}

module.exports = PageLogs
</script>
<style lang="css" scoped></style>