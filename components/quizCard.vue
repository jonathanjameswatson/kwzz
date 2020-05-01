<template>
  <div class="card">
    <div class="card-content">
      <p class="title">{{ quiz.Title }}</p>
      <div class="buttons">
        <template v-if="quiz.owner === $auth.user.id">
          <k-link v-if="quiz.isPublished === 1" :link="`/quiz/${quiz.id}/players`">Players</k-link>
          <k-link v-else :link="`/quiz/${quiz.id}/edit`">Edit</k-link>
        </template>
        <k-link v-if="quiz.IsPublished === 1" :link="`/quiz/${quiz.Id}/play`">Play</k-link>
      </div>
    </div>
  </div>
</template>

<script>
import kLink from '~/components/kLink'

export default {
  components: {
    kLink
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
