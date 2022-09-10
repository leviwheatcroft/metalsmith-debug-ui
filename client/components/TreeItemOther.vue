<template lang="pug">
.tree-item-other(
  class="hover:bg-slate-100 flex flex-row"
)
  Indent(
    :depth="depth"
  )
  .name(
    class="w-64 flex-shrink-0"
  ) {{ name }} &nbsp;:
  .other(
    class=""
  ) {{ data }}
</template>
<script>
const { default: Indent } = require('./Indent')
const TreeItemOther = {
  components: {
    Indent
  },
  data () {
    return {
      isOpen: false
    }
  },
  methods: {},
  props: {
    name: {
      required: true,
      type: String
    },
    data: {
      required: true
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

module.exports = TreeItemOther

</script>
<style lang="css" scoped></style>
