<template>
  <div class="section">
    <h1 class="title">Search</h1>
    <set-of-quizzes
      :limit="limit"
      :offset="offset"
      :isUser="isUser"
      :searchString="searchString"
      :key="`${searchString}${offset}`"
    />
  </div>
</template>

<script>
import SetOfQuizzes from '~/components/setOfQuizzes'

export default {
  watchQuery: true,
  asyncData({ query }) {
    const { page, searchString } = query
    let { isUser } = query

    if (isUser) {
      isUser = true
    }

    const limit = 9
    const offset = (page || 0) * limit

    return {
      limit,
      offset,
      isUser,
      searchString
    }
  },
  components: {
    SetOfQuizzes
  }
}
</script>
