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
const props = defineProps({
  error: Object,
})

const handleError = () => clearError({ redirect: '/' })
</script>
