<template>
  <b-button
    type="is-primary"
    rounded
    outlined
    tag="nuxt-link"
    :disabled="broken"
    :to="broken ? '/' : link"
    :event="broken || back ? '' : 'click'"
    @click.native="goBack"
  >
    <slot />
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
    },
    back: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    goBack() {
      if (this.back && !this.disabled) {
        this.$router.back()
      }
    }
  }
}
</script>
