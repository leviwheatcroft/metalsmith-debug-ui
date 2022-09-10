<template lang="pug">
.tree-item-number(
  class="hover:bg-slate-100 flex flex-row"
)
  Indent(
    :depth="depth"
  )
  .name(
    class="inline-block w-64 flex-shrink-0"
  ) {{ name }} &nbsp;:
  .number(
    class="text-green-700"
  ) {{ data }}
</template>
<script>
const { default: Indent } = require('./Indent')
const TreeItemNumber = {
  components: {
    Indent
  },
  data () {
    return {}
  },
  methods: {},
  props: {
    name: {
      required: true,
      type: String
    },
    data: {
      required: true,
      type: Number
    },
    pickTreeItem: {
      required: true,
      type: Function
    },
    depth: {
      required: true,
      type: Number
    }
  }
}

module.exports = TreeItemNumber
</script>
<style lang="css" scoped></style>
