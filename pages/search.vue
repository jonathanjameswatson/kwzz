<template>
  <KwzzSection>
    <KwzzHeader>Search</KwzzHeader>
    <QuizSet
      :page="page"
      :limit="limit"
      :is-user="isUser"
      :search-string="searchString"
      fetch-key="search"
      paginate
      @update:page="setPage"
    />
  </KwzzSection>
</template>

<script setup lang="ts">
const route = useRoute()

const limit = 9
const page = computed(() => {
  const parsedInt = parseInt(locationQueriesToString(route.query.page), 10)
  return isNaN(parsedInt) || parsedInt < 1 ? 1 : parsedInt
})
const isUser = computed(() => route.query.user === '')
const searchString = computed(() => locationQueriesToString(route.query.q))

const setPage = (page: number) => {
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
