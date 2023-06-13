<template>
  <div class="section">
    <h1 class="title is-1">
      <span v-if="error.statusCode === 404">Page not found</span>
      <span v-else>An error occurred</span>
    </h1>
    <OButton @click="handleError">Home</OButton>
  </div>
</template>

<script setup>
defineProps({
  error: {
    type: Object,
    default() {
      return Object.create(null)
    },
  },
})

const handleError = () => clearError({ redirect: '/' })
</script>
