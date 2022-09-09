<template lang="pug">
tr.log-item(
  class="hover:bg-slate-100"
)
  td.elapsed(
    class="align-top px-2 text-right text-green-400"
  ) {{ elapsed }}
  td.plugin(
    class="align-top px-2 text-blue-400"
  ) {{ plugin.replace(/^@metalsmith\//, '@ms/') }}
  td.message(
    class="px-2 text-slate-800"
  )
    pre {{ message }}

</template>
<script>
const LogItem = {
  data () {
    return {}
  },
  methods: {},
  props: {
    elapsed: {
      required: true,
      type: String
    },
    plugin: {
      required: true,
      type: String
    },
    message: {
      required: true,
      type: String
    }
  }
}

module.exports = LogItem
</script>
<style lang="css" scoped></style>
