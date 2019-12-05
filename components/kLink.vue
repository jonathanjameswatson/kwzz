<template>
  <b-button
    type="is-primary"
    rounded
    outlined
    tag="nuxt-link"
    :disabled="broken"
    :to="broken ? '/' : link"
    :event="broken ? '' : 'click'"
  >
    <slot/>
  </b-button>
</template>

<script>
export default {
  props: {
    broken: {
      type: Boolean,
      default: false
    },
    link: {
      type: String,
      default: '/'
    }
  }
}
</script>
