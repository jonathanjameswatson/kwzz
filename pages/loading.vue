<template>
  <div style="height: 100vh" />
  <OLoading :active="true" />
</template>

<script setup lang="ts">
definePageMeta({
  isVisibleTo: 'signedOut',
})
</script>
