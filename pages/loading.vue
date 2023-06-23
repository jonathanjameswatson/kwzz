<template>
  <div>
    <div style="height: 100vh" />
    <OLoading :active="true" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  isVisibleTo: 'signedOut',
  layout: 'empty',
})

const user = useSupabaseUser()
watchEffect(async () => {
  if (user.value) {
    await navigateTo('/home')
  }
})
</script>
