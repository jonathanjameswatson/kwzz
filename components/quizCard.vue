<template>
  <article class="card">
    <div class="card-content">
      <h3 class="title">{{ title }}</h3>
      <div class="buttons">
        <template v-if="isOwnQuiz">
          <KwzzLink v-if="isPublished" :link="`/quiz/${id}/recentattempts`">
            Recent attempts
          </KwzzLink>
          <KwzzLink v-else :link="`/quiz/${id}/edit`">Edit</KwzzLink>
        </template>
        <KwzzLink v-if="isPublished" :link="`/quiz/${id}/play`">Play</KwzzLink>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: number
  title: string
  creatorId: string
  isPublished: boolean
}>()

const user = useSupabaseUser()
const isOwnQuiz = computed(() => {
  if (user.value === null) {
    return false
  }
  return props.creatorId === user.value.id
})
</script>
