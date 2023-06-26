<template>
  <KwzzSection>
    <div v-if="data !== null">
      <QuizEditor :id="id" v-model="data.quiz" />
    </div>
  </KwzzSection>
</template>

<script setup lang="ts">
import type { Database } from '~/types/database.generated'

const supabaseClient = useSupabaseClient<Database>()
const {
  params: { id: idParam },
} = useRoute()
const id = computed(() => (typeof idParam === 'string' ? parseInt(idParam) : 0))

const { data } = await useAsyncData('edit', async () => {
  const { data, error } = await supabaseClient
    .from('quizzes')
    .select('title, questions')
    .eq('id', parseInt(id.value.toString(), 10))
    .limit(1)
    .single()

  if (error !== null) {
    throw error
  }

  const { title, questions } = data
  const quiz = { title, questions }
  markRaw(quiz)
  markRaw(questions)
  questions.forEach((question) => {
    markRaw(question)
    markRaw(question.answers)
  })
  return { quiz }
})
</script>
