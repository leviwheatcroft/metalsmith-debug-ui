<template lang="pug">
tr.log-item(
  class="hover:bg-slate-100"
)
  td.timestamp(
    class="text-slate-400"
  ) {{ timestamp }}
  td.elapsed(
    class="text-right text-green-400"
  ) {{ elapsed }}
  td.plugin(
    class="text-blue-400"
  ) {{ plugin.replace(/^@metalsmith\//, '@ms/') }}
  td.message(
    class="text-slate-800"
  ) {{ message }}

</template>
<script>
const LogItem = {
  data () {
    return {}
  },
  methods: {},
  props: {
    timestamp: {
      required: true,
      type: String
    },
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
