<template lang="pug">
.indent(
  class="inline-block"
)
  .spacer(
    v-for="key in Array(depth).fill(0)"
    :key=key
    class="inline-block w-4 border-l border-slate-200 border-dotted"
  ) &nbsp;

</template>
<script>
const Indent = {
  data () {
    return {}
  },
  methods: {},
  props: {
    depth: {
      required: true,
      type: Number
    }
  }
}

module.exports = Indent
</script>
<style lang="css" scoped></style>
