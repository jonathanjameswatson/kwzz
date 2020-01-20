<template>
  <div class="columns is-multiline">
    <div class="column is-4" v-for="quiz in quizzes" :key="quiz.Id">
      <div class="card">
        <div class="card-content">
          <p class="title">{{ quiz.Title }}</p>
          <div class="buttons">
            <template v-if="quiz.Owner.toString() === $auth.user.id">
              <k-link
                v-if="quiz.IsPublished === 1"
                broken
                :link="`/quiz/${quiz.Id}/players`"
              >Players</k-link>
              <k-link v-else :link="`/quiz/${quiz.Id}/edit`">Edit</k-link>
            </template>
            <k-link v-if="quiz.IsPublished === 1" broken :link="`/quiz/${quiz.Id}/play`">Play</k-link>
          </div>
        </div>
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
  data() {
    return {
      quizzes: []
    }
  },
  async mounted() {
    const { quizzes } = await this.$axios.$get('/api/quiz', {
      params: {
        offset: this.offset,
        limit: this.limit,
        isUser: this.isUser,
        searchString: this.searchString
      }
    })

    this.quizzes = quizzes
  }
}
</script>
