<template>
  <div>
    <NuxtLoadingIndicator color="#962865" />
    <KwzzNavbar />
    <main>
      <NuxtPage />
    </main>
    <KwzzFooter />
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const user = useSupabaseUser()
watch(user, () => {
  router.go(0)
})
</script>
