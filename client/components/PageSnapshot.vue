<template lang="pug">
.snapshot-page(
  class="flex flex-col min-h-screen"
)
  Nav
  .body(
    class="flex flex-row gap-4 container items-start mx-auto mt-8"
  )
    .snapshot-list(
      class="w-52 mr-8"
    )
      h1(
        class="text-2xl"
      ) Snapshots
      ul
        li.snapshot-list-item(
          :class="{'bg-slate-300': state.selectedSnapshot === idx }"
          class="p-4 cursor-pointer"
          v-for="(snapshot, idx) in snapshots"
          :key="idx"
          @click="setState('selectedSnapshot', idx)"
        ) {{ snapshot.fnName }}
    SnapshotTree(
      class="flex-grow"
      :snapshot="snapshots[state.selectedSnapshot]"
      :selectedSnapshot="state.selectedSnapshot"
    )
  .spacer(
    class="flex-grow"
  )
  Footer
</template>
<script>
const { default: SnapshotTree } = require('./SnapshotTree')
const { default: Nav } = require('./Nav')
const { default: Footer } = require('./Footer')
const { state, setState } = require('../store')

const PageSnapshot = {
  components: {
    SnapshotTree,
    Nav,
    Footer
  },
  data () {
    return {
      state
    }
  },
  methods: {
    setState
  },
  props: {
    snapshots: {
      required: true,
      type: Array
    }
  }
}

module.exports = PageSnapshot
</script>
<style lang="css" scoped></style>