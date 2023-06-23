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
        v-if="page !== undefined"
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
    limit?: number
    offset?: number
    onlyShowUsersQuizzes?: boolean
    searchString?: string
    fetchKey: string
    page?: number
  }>(),
  {
    limit: 3,
    offset: 0,
    onlyShowUsersQuizzes: false,
    searchString: '',
    page: undefined,
  }
)

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
      .range(props.offset, props.offset + props.limit - 1)
    if (error !== null) {
      throw error
    }
    return { quizzes: data, total: count ?? data.length }
  },
  {
    watch: [props],
  }
)

const route = useRoute()
const setPage = async (page: number) => {
  const { q, user } = route.query
  navigateTo({
    query: {
      page: page.toString(),
      ...(q !== undefined ? { q } : Object.create(null)),
      ...(user !== undefined ? { user } : Object.create(null)),
    },
  })
}
</script>
