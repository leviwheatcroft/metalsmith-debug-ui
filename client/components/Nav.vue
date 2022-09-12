<template lang="pug">
Nav(
  class="bg-slate-700 text-slate-100"
)
  .nav(
    class="container mx-auto flex flex-row gap-4 m-2 px-8"
  )
    .brand(
      class="text-xl leading-10"
    ) Metalsmith Debug UI
    .page(
      :class="{ 'border-b': state.page === 'snapshots' }"
      class="ml-8 leading-10 border-slate-100 cursor-pointer"
      @click="setState('page', 'snapshots')"
    ) Snapshots
    .page(
      :class="{ 'border-b': state.page === 'logs' }"
      class="leading-10 border-slate-100 cursor-pointer"
      @click="setState('page', 'logs')"
    ) Logs
    .spacer(
      class="flex-grow"
    )
    .github(
      class="leading-10"
    )
      a(
        href="https://github.com/leviwheatcroft/metalsmith-debug-ui"
        class="relative top-2.5"
      )
        IconGithub
</template>
<script>
const { state, setState } = require('../store')
const { default: IconGithub } = require('./IconGithub')
const Nav = {
  components: {
    IconGithub
  },
  data () {
    return {
      state
    }
  },
  methods: {
    setState
  },
  props: {}
}
module.exports = Nav
</script>
<style lang="css" scoped></style>
