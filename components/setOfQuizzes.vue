<template>
  <div class="columns is-multiline is-vcentered">
    <div v-for="quiz in quizzes" :key="quiz.id" class="column is-4">
      <quizCard
        :id="quiz.id"
        :title="quiz.title"
        :owner="quiz.owner"
        :is-published="quiz.ispublished"
      />
    </div>
    <b-loading :active="$fetchState.pending" />
  </div>
</template>

<script>
import quizCard from '~/components/quizCard'

export default {
  components: {
    quizCard
  },
  props: {
    limit: {
      type: Number,
      default: 3
    },
    offset: {
      type: Number,
      default: 0
    },
    isUser: {
      type: Boolean,
      default: false
    },
    searchString: {
      type: String,
      default: ''
    }
  },
  async fetch() {
    const { quizzes, total } = await this.$axios.$get('/api/quiz', {
      params: {
        offset: this.offset,
        limit: this.limit,
        isUser: this.isUser,
        searchString: this.searchString
      }
    })

    this.quizzes = quizzes
    this.$emit('total', total)
  },
  data() {
    return {
      quizzes: []
    }
  }
}
</script>
