<template>
  <KwzzSection>
    <KwzzHeader>Search</KwzzHeader>
    <QuizSet
      :limit="limit"
      :offset="offset"
      :is-user="isUser"
      :search-string="searchString"
      fetch-key="search"
      :page="page"
    />
  </KwzzSection>
</template>

<script setup lang="ts">
import { locationQueriesToString } from '~/utils/locationQuery'

const route = useRoute()

console.log('rerunning setup')

const limit = 9
const page = computed(() => {
  const parsedInt = parseInt(locationQueriesToString(route.query.page), 10)
  return isNaN(parsedInt) || parsedInt < 1 ? 1 : parsedInt
})
const offset = computed(() => (page.value - 1) * limit)
const isUser = computed(() => route.query.user === '')
const searchString = computed(() => locationQueriesToString(route.query.q))
</script>
