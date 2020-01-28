<template>
  <div class="section">
    <h1 class="title">You are not signed in</h1>
    <p class="subtitle">Click the sign in button in the top right to visit this page.</p>
    <k-link link="/">Return to home</k-link>
  </div>
</template>

<script>
import kLink from '~/components/kLink'

export default {
  auth: 'guest',
  components: { kLink }
}
</script>
