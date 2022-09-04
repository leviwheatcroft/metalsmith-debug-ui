<template lang="pug">
.snapshot-tree
  .files
    h1(
      class="text-2xl"
    ) Files
    component(
      v-bind:is="pickTreeItem(snapshot.files)"
      :name="'root'"
      :data="snapshot.files"
      :pickTreeItem="pickTreeItem"
      :depth="0"
    )
  .metadata
    h1(
      class="text-2xl mt-4"
    ) Meta
    component(
      v-bind:is="pickTreeItem(snapshot.metadata)"
      :name="'root'"
      :data="snapshot.metadata"
      :pickTreeItem="pickTreeItem"
      :depth="0"
    )
</template>
<script>
const { default: TreeItemString } = require('./TreeItemString')
const { default: TreeItemNumber } = require('./TreeItemNumber')
const { default: TreeItemArray } = require('./TreeItemArray')
const { default: TreeItemObject } = require('./TreeItemObject')
const { default: TreeItemOther } = require('./TreeItemOther')
const { default: TreeItemCopy } = require('./TreeItemCopy')

const SnapshotTree = {
  data () {
    return {}
  },
  methods: {
    pickTreeItem (data) {
      if (
        typeof data === 'string' &&
        /^\[Copy/.test(data)
      ) return TreeItemCopy
      if (typeof data === 'string') return TreeItemString
      if (typeof data === 'number') return TreeItemNumber
      if (Array.isArray(data)) return TreeItemArray
      if (
        data === undefined ||
        data === null ||
        typeof data === 'boolean'
      ) return TreeItemOther
      return TreeItemObject
    }
  },
  props: {
    snapshot: {
      required: true,
      type: Object
    },
    selectedSnapshot: {
      required: true,
      type: Number
    }
  }
}

module.exports = SnapshotTree
</script>
<style lang="css" scoped></style>
