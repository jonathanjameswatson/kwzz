<template>
  <KwzzSection>
    <KwzzHeader>Search</KwzzHeader>
    <QuizSet
      :key="`${searchString}${offset}`"
      :limit="limit"
      :offset="offset"
      :is-user="isUser"
      :search-string="searchString"
      fetch-key="search"
      @total="setTotal"
    />
    <OPagination
      v-model:current="page"
      :total="total"
      :per-page="limit"
      @change="setPage"
    />
  </KwzzSection>
</template>

<script setup lang="ts">
import { locationQueriesToString } from '~/utils/locationQuery'

const route = useRoute()

const limit = 9
const page = computed(() => {
  const parsedInt = parseInt(locationQueriesToString(route.query.page), 10)
  return isNaN(parsedInt) || parsedInt < 1 ? 1 : parsedInt
})
const offset = computed(() => (page.value - 1) * limit)
const isUser = computed(() => route.query.user !== '')
const searchString = computed(() =>
  locationQueriesToString(route.query.searchString)
)

const total = useState('searchTotal', () => 0)

const setTotal = (newTotal: number) => {
  total.value = newTotal
}

const setPage = (page: number) => {
  navigateTo({
    query: {
      page: page.toString(),
      searchString: searchString.value,
      user: isUser.value ? '' : undefined,
    },
  })
}
</script>
