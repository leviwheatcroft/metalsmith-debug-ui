<template lang="pug">
.tree-item-copyg(
  class="hover:bg-slate-100"
)
  Indent(
    :depth="depth"
  )
  .name(
    class="inline-block w-64"
  ) {{ name }} &nbsp;:
  .string(
    class="inline-block text-purple-700"
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
