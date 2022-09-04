<template lang="pug">
.tree-item-object(
  class=""
)
  .top-row(
    class="cursor-pointer hover:bg-slate-100"
    @click="isOpen = !isOpen"
  )
    Indent(
      :depth="depth"
    )
    .name(
      class="inline-block w-64"
    ) {{ name }} &nbsp;:
    .object-notation-open(
      class="inline-block"
      v-if="isOpen"
    ) {
    .object-notation-closed(
      class="inline-block"
      v-if="!isOpen"
    ) {{ `{ ... } (${Object.keys(data).length} properties)` }}
  .body(
    v-if="isOpen"
    class=""
  )
    component(
      v-for="(item, key) in data"
      :key="key"
      :name="key"
      v-bind:is="pickTreeItem(item)"
      :data="item"
      :pickTreeItem="pickTreeItem"
      :depth="depth + 1"
    )
  .bottom-row(
    class="cursor-pointer hover:bg-slate-100"
    @click="isOpen = !isOpen"
    v-if="isOpen"
  )
    Indent(
      :depth="depth"
    )
    .object-notation-close(
      class="inline-block"
    ) }
</template>
<script>
const { default: Indent } = require('./Indent')
const TreeItemObject = {
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
      type: Object
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

module.exports = TreeItemObject
</script>
<style lang="css" scoped></style>
