<template>
  <div class="section">
    <h1 class="title is-1">{{ title }}</h1>
    <hr>
    <div class="columns is-multiline">
      <div v-for="(question, i) in questions" :key="i" class="column is-full">
        <div class="card">
          <div class="card-content">
            <p class="title">{{ question.question }}</p>

            <b-dropdown
              v-if="question.type !== 'Text answer question' "
              v-model="answers[i]"
              :multiple="question.type === 'Multiple answer question'"
              aria-role="list"
            >
              <b-button
                type="is-primary"
                rounded
                outlined
                icon-right="menu-down"
                slot="trigger"
              >{{ dropdowns[i] }}</b-button>

              <b-dropdown-item
                v-for="(answer, j) in question.answers"
                :key="j"
                :value="answer[1]"
                aria-role="listitem"
              >{{ answer[0] }}</b-dropdown-item>
            </b-dropdown>

            <b-input
              v-else
              v-model="answers[i]"
              placeholder="Input your answer"
              maxlength="50"
              :has-counter="false"
              rounded
            />
          </div>
        </div>
      </div>
    </div>
    <hr>
    <b-button
      type="is-primary"
      rounded
      outlined
      @click="submit()"
      :disabled="submittable"
    >Submit quiz</b-button>
  </div>
</template>

<script>
export default {
  async asyncData({ params, $axios }) {
    const id = params.id
    const quiz = await $axios.$get(`/api/quiz/${id}/questions`)
    return {
      title: quiz.title,
      questions: quiz.questions,
      id,
      answers: quiz.questions.map((question) => null),
      startTime: 0
    }
  },
  computed: {
    dropdowns() {
      return this.questions.map((question, i) => {
        if (question.type === 'Single answer question') {
          if (question.answers[this.answers[i]] !== undefined) {
            return question.answers.find(
              (answer) => answer[1] === this.answers[i]
            )[0]
          }
          return 'Select answer'
        } else if (question.type === 'Multiple answer question') {
          if (!this.answers[i]) {
            return 'Select answers'
          }
          return `${this.answers[i].length} answer selected`
        }
        return null
      })
    },
    submittable() {
      return this.answers.some((answer) => answer === null)
    }
  },
  mounted() {
    this.startTime = new Date().getTime()
  },
  methods: {
    async submit() {
      const loading = this.$buefy.loading.open()

      const { done } = await this.$axios.$post(`/api/result/${this.id}`, {
        answers: this.answers,
        timeTaken: new Date().getTime() - this.startTime
      })

      if (done) {
        this.$router.push({ path: `results` })
      }

      loading.close()
    }
  }
}
</script>
