<template lang="pug">
.tree-item-array(
  class=""
)
  .top-row(
    class="cursor-pointer"
    @click="isOpen = !isOpen"
  )
    Indent(
      :depth="depth"
    )
    .name(
      class="inline-block w-64"
    ) {{ name }} &nbsp;:
    .array-notation-open(
      class="inline-block"
      v-if="isOpen"
    ) [
    .array-notation-closed(
      class="inline-block"
      v-if="!isOpen"
    ) {{ `[ ... ] (${data.length} items)` }}
  .body(
    v-if="isOpen"
    class=""
  )
    component(
      v-for="(item, key) in data"
      v-bind:is="pickTreeItem(item)"
      :key="key"
      :name="key + ''"
      :data="item"
      :pickTreeItem="pickTreeItem"
      :depth="depth + 1"
    )
  .bottom-row(
    class="cursor-pointer"
    @click="isOpen = !isOpen"
    v-if="isOpen"
  )
    Indent(
      :depth="depth"
    )
    .array-notation-close(
      class="inline-block"
    ) ]
</template>
<script>
const { default: Indent } = require('./Indent')
const TreeItemArray = {
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
      required: true,
      type: Array
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

module.exports = TreeItemArray

</script>
<style lang="css" scoped></style>
