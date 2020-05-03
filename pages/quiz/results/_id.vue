<template>
  <div class="section">
    <h1 class="title is-1">{{ title }}</h1>
    <h2 class="subtitle is-3">Attempt</h2>
    <hr />
    <div class="columns is-multiline">
      <div v-for="(question, i) in questions" :key="i" class="column is-full">
        <div class="card">
          <div class="card-content">
            <p class="title">
              <span>{{ question.question }}</span>
              <b-icon
                v-if="attempt[i].correctAnswer === true"
                icon="check"
                type="is-success"
                size="is-medium"
              />
              <b-icon v-else icon="close" type="is-danger" size="is-medium" />
            </p>

            <div class="message is-primary">
              <div class="message-body">
                Your answer was: {{ attempt[i].userAnswer }}
              </div>
            </div>
            <div
              v-if="attempt[i].correctAnswer !== true"
              class="message is-success"
            >
              <div class="message-body">
                The correct answer was: {{ attempt[i].correctAnswer }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ params, $axios }) {
    const id = params.id
    const { attempt, quizId } = await $axios.$get(`/api/result/attempt/${id}`)
    const { title, questions } = await $axios.$get(
      `/api/quiz/${quizId}/questions`
    )
    return {
      title,
      questions,
      attempt,
      id,
      quizId
    }
  }
}
</script>
