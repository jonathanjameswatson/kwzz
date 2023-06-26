<template>
  <KwzzSection>
    <header class="block">
      <OField label="Search" grouped group-multiline>
        <div class="control is-expanded">
          <OInput
            v-model="searchString"
            maxlength="50"
            :has-counter="false"
            size="large"
            @keyup.enter="search"
          />
        </div>
        <div class="control">
          <OButton size="large" @click="search">Search</OButton>
        </div>
      </OField>
    </header>

    <OField label="Filters" grouped group-multiline class="mb-5">
      <div class="control">
        <ToggleButton v-model="isUser">Only show own quizzes?</ToggleButton>
      </div>
    </OField>

    <QuizSet
      :page="page"
      :limit="limit"
      :is-user="isUserUrl"
      :search-string="searchStringUrl"
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
const isUserUrl = computed(() => route.query.user === '')
const searchStringUrl = computed(() => locationQueriesToString(route.query.q))

const setPage = async (page: number) => {
  const { q, user } = route.query
  await navigateTo({
    query: {
      page: page.toString(),
      ...(q !== undefined ? { q } : Object.create(null)),
      ...(user !== undefined ? { user } : Object.create(null)),
    },
  })
}

const isUser = useState('isUser', () => isUserUrl.value)
watchEffect(() => {
  isUser.value = isUserUrl.value
})
const searchString = useState('searchString', () => searchStringUrl.value)
watchEffect(() => {
  searchString.value = searchStringUrl.value
})

const search = async () => {
  await navigateTo({
    query: {
      q: searchString.value,
      ...(isUser.value !== isUserUrl.value
        ? isUser.value
          ? { user: '' }
          : {}
        : { user: route.query.user }),
    },
  })
}
</script>
