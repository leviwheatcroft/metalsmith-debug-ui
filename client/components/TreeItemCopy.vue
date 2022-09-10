<template lang="pug">
.tree-item-copyg(
  class="hover:bg-slate-100 flex flex-row"
)
  Indent(
    :depth="depth"
  )
  .name(
    class="w-64 flex-shrink-0"
  ) {{ name }} &nbsp;:
  .string(
    class="text-purple-700"
  ) {{ data }}
</template>
<script>
const { default: Indent } = require('./Indent')

const TreeItemCopy = {
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
      type: String
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

module.exports = TreeItemCopy
</script>
<style lang="css" scoped></style>
