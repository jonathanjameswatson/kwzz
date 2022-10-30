<template>
  <div class="columns is-multiline is-vcentered">
    <div v-for="quiz in data" :key="quiz.id" class="column is-4">
      <QuizCard
        :id="quiz.id"
        :title="quiz.title"
        :creator-id="quiz.creator_id"
        :is-published="quiz.is_published"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Quizzes } from '~/types/database.generated'

const props = withDefaults(
  defineProps<{
    limit?: number
    offset?: number
    onlyShowUsersQuizzes?: boolean
    searchString?: string
    fetchKey: string
  }>(),
  {
    limit: 3,
    offset: 0,
    onlyShowUsersQuizzes: false,
    searchString: '',
  }
)

const emit = defineEmits<{
  (e: 'total', total: number): void
}>()

const supabaseClient = useSupabaseClient()

const { data } = await useAsyncData(
  props.fetchKey,
  async () => {
    const selectQuery = supabaseClient
      .from<Quizzes>('quizzes')
      .select('id, title, creator_id, is_published', { count: 'exact' })
    const searchedSelectQuery =
      props.searchString === ''
        ? selectQuery
        : selectQuery.textSearch(
            'fts',
            props.searchString
              .split(' ')
              .map((word) => word.trim())
              .filter((word) => word.length > 0)
              .join(' | ')
          )
    const { data, count } = await searchedSelectQuery
      .order('updated_at', { ascending: false })
      .range(props.offset, props.offset + props.limit - 1)
    emit('total', count)
    return data
  },
  {
    initialCache: false,
  }
)
</script>
