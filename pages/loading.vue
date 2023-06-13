<template>
  <div>
    <div style="height: 100vh" />
    <OLoading :active="true" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  isVisibleTo: 'signedOut',
})
</script>
