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
watchEffect(() => {
  if (user.value) {
    navigateTo('/home')
  }
})
</script>
