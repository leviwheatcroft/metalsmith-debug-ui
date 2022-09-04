<template lang="pug">
.tree-item-other(
  class="hover:bg-slate-100"
)
  Indent(
    :depth="depth"
  )
  .name(
    class="inline-block w-64"
  ) {{ name }} &nbsp;:
  .other(
    class="inline-block"
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
