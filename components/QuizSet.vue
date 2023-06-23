<template>
  <div class="block">
    <div v-if="data !== null">
      <div class="columns is-multiline is-vcentered">
        <div v-for="quiz in data.quizzes" :key="quiz.id" class="column is-4">
          <QuizCard
            :id="quiz.id"
            :title="quiz.title"
            :creator-id="quiz.creator_id"
            :is-published="quiz.is_published"
          />
        </div>
      </div>
      <OPagination
        v-if="paginate"
        :current="page"
        :total="data.total"
        :per-page="limit"
        @change="setPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Database } from '~/types/database.generated'

const props = withDefaults(
  defineProps<{
    page: number
    limit?: number
    onlyShowUsersQuizzes?: boolean
    searchString?: string
    fetchKey: string
    paginate: boolean
  }>(),
  {
    page: 1,
    limit: 3,
    onlyShowUsersQuizzes: false,
    searchString: '',
    page: undefined,
    paginate: false,
  }
)

const emit = defineEmits<{
  'update:page': [page: number]
}>()

const offset = computed(() => (props.page - 1) * props.limit)

const supabaseClient = useSupabaseClient<Database>()

const { data } = await useAsyncData(
  props.fetchKey,
  async () => {
    const selectQuery = supabaseClient
      .from('quizzes')
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
    const { data, error, count } = await searchedSelectQuery
      .order('updated_at', { ascending: false })
      .range(offset.value, offset.value + props.limit - 1)
    if (error !== null) {
      throw error
    }
    return { quizzes: data, total: count ?? data.length }
  },
  {
    watch: [props],
  }
)

const setPage = (page: number) => {
  emit('update:page', page)
}
</script>
