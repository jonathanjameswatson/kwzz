<template>
  <div class="section">
    <h1 class="title">Search</h1>
    <set-of-quizzes
      :limit="limit"
      :offset="offset"
      :isUser="isUser"
      :searchString="searchString"
      :key="`${searchString}${offset}`"
      @total="setTotal"
    />
    <b-pagination :total="total" :per-page="limit" :current.sync="page" @change="setPage"/>
  </div>
</template>

<script>
import SetOfQuizzes from '~/components/setOfQuizzes'

export default {
  watchQuery: true,
  asyncData({ query }) {
    const { searchString } = query
    let { page, isUser } = query

    if (isUser) {
      isUser = true
    } else {
      isUser = false
    }

    if (!page) {
      page = 1
    }

    const limit = 9
    const offset = (page - 1) * limit

    return {
      limit,
      offset,
      page,
      isUser,
      searchString,
      total: 0
    }
  },
  components: {
    SetOfQuizzes
  },
  methods: {
    setTotal(total) {
      this.total = total
    },
    setPage(page) {
      this.$router.push({ query: { page, isUser: this.isUser, searchString: this.searchString } })
    }
  }
}
</script>
