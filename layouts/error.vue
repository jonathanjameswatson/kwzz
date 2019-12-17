<template>
  <div class="section">
    <h1 class="title is-1">
      <span v-if="error.statusCode === 404">
        Page not found
      </span>
      <span v-else>An error occurred</span>
    </h1>
    <k-link link="/">
      Home
    </k-link>
  </div>
</template>

<script>
import kLink from "~/components/kLink"
export default {
  props: ['error'],
  components: {
    kLink
  }
}
</script>
