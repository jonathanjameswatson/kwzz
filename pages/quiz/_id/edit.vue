<template>
  <div class="section">
    <b-field label="Quiz title" type="is-primary">
      <b-input v-model="title" size="is-large" maxlength="50" required />
    </b-field>

    <div class="columns is-multiline">
      <div v-for="(question, i) in questions" :key="i" class="column is-full">
        <div class="card">
          <div class="card-content">
            <b-field :label="`Question ${i + 1}`" type="is-primary">
              <b-input
                v-model="question.question"
                size="is-medium"
                type="textarea"
                maxlength="200"
              />
            </b-field>

            <b-field grouped group-multiline>
              <div class="control">
                <b-dropdown v-model="question.type" aria-role="list">
                  <b-tooltip
                    slot="trigger"
                    label="Single answer requires one correct answer to be picked. Multiple answer requires each correct answer to be picked. Text answer requires one answer to be typed in."
                    multilined
                    animated
                  >
                    <b-button type="is-primary" icon-right="menu-down" outlined>
                      {{ question.type }}
                    </b-button>
                  </b-tooltip>

                  <b-dropdown-item
                    aria-role="listitem"
                    value="Single answer question"
                  >
                    Single answer question
                  </b-dropdown-item>
                  <b-dropdown-item
                    aria-role="listitem"
                    value="Multiple answer question"
                  >
                    Multiple answer action
                  </b-dropdown-item>
                  <b-dropdown-item
                    aria-role="listitem"
                    value="Text answer question"
                  >
                    Text answer question
                  </b-dropdown-item>
                </b-dropdown>
              </div>

              <b-field type="is-primary" expanded class="mb-3">
                <b-taginput
                  v-model="question.topics"
                  ellipsis
                  icon="label"
                  placeholder="Add a topic and press enter"
                  maxlength="30"
                  maxtags="10"
                  :has-counter="false"
                  rounded
                  type="is-primary"
                />
              </b-field>

              <b-checkbox-button
                v-if="question.type !== 'Text answer question'"
                v-model="question.shuffle"
                type="is-primary"
              >
                <b-icon :icon="question.shuffle ? 'close' : 'check'" />
                <span>Shuffle answers?</span>
              </b-checkbox-button>
            </b-field>

            <b-table :data="question.answers">
              <b-table-column
                v-slot="props"
                field="isCorrect"
                label="Correct?"
                width="0"
                centered
                :visible="question.type !== 'Text answer question'"
              >
                <b-checkbox v-model="props.row.isCorrect" size="is-medium" />
              </b-table-column>

              <b-table-column v-slot="props" field="answer" label="Answer">
                <b-field type="is-primary" expanded>
                  <b-input
                    v-model="props.row.answer"
                    placeholder="Answer"
                    rounded
                    maxlength="50"
                    :has-counter="false"
                  />
                </b-field>
              </b-table-column>

              <b-table-column v-slot="props" label="Delete" width="0" centered>
                <span>
                  <b-button
                    type="is-primary"
                    outlined
                    icon-right="minus"
                    size="is-default"
                    @click.native="removeAnswer(i, props.index)"
                  />
                </span>
              </b-table-column>

              <template slot="footer">
                <div class="buttons">
                  <b-button
                    type="is-primary"
                    icon-right="plus"
                    rounded
                    outlined
                    @click="addAnswer(i)"
                  >
                    Add answer
                  </b-button>
                  <b-button
                    type="is-primary"
                    icon-right="arrow-up"
                    rounded
                    outlined
                    @click="swapQuestions(i - 1)"
                  >
                    Move up
                  </b-button>
                  <b-button
                    type="is-primary"
                    icon-right="arrow-down"
                    rounded
                    outlined
                    @click="swapQuestions(i)"
                  >
                    Move down
                  </b-button>
                  <b-button
                    type="is-primary"
                    icon-right="minus"
                    rounded
                    outlined
                    @click="removeQuestion(i)"
                  >
                    Delete question
                  </b-button>
                </div>
              </template>
            </b-table>
          </div>
        </div>
      </div>
    </div>

    <hr />

    <div ref="bottom" class="buttons">
      <b-button
        type="is-primary"
        icon-right="plus"
        rounded
        outlined
        @click="addQuestion()"
      >
        Add question
      </b-button>
      <b-button
        type="is-primary"
        icon-right="content-save"
        rounded
        outlined
        :disabled="saved"
        @click="save()"
      >
        Save quiz
      </b-button>
      <k-link link="play" :broken="id === '0'">
        <span>View quiz</span>
        <b-icon icon="eye" size="is-small" />
      </k-link>
      <b-button
        type="is-primary"
        icon-right="publish"
        rounded
        outlined
        :disabled="!saved || id === '0'"
        @click="publish()"
      >
        Publish quiz
      </b-button>
    </div>
  </div>
</template>

<script>
import kLink from '~/components/kLink'

export default {
  components: { kLink },
  async asyncData({ params, $axios }) {
    const id = params.id
    const quiz = await $axios.$get(`/api/quiz/${id}`)
    return {
      title: quiz.title,
      questions: quiz.questions,
      id,
      saved: true
    }
  },
  watch: {
    questions: {
      deep: true,
      handler() {
        if (this.saved) {
          this.saved = false
        }
      }
    },
    title() {
      if (this.saved) {
        this.saved = false
      }
    }
  },
  methods: {
    addQuestion() {
      if (this.questions.length === 30) {
        this.$buefy.toast.open({
          message:
            'You have reached the maximum number of questions for this quiz.',
          position: 'is-bottom',
          type: 'is-danger'
        })
        return false
      }
      this.questions.push({
        question: '',
        type: 'Single answer question',
        shuffle: true,
        answers: [
          {
            answer: '',
            isCorrect: true
          },
          {
            answer: '',
            isCorrect: false
          }
        ],
        topics: []
      })
      this.$refs.bottom.scrollIntoView()
    },
    addAnswer(i) {
      if (this.questions[i].answers.length === 10) {
        this.$buefy.toast.open({
          message:
            'You have reached the maximum number of answers for this question.',
          position: 'is-bottom',
          type: 'is-danger'
        })
        return false
      }
      this.questions[i].answers.push({
        answer: '',
        isCorrect: false
      })
    },
    removeQuestion(i) {
      this.questions.splice(i, 1)
    },
    removeAnswer(questionI, i) {
      this.questions[questionI].answers.splice(i, 1)
    },
    swapQuestions(startI) {
      if (startI === -1 || startI + 1 === this.questions.length) {
        return false
      }

      this.questions.splice(
        startI,
        2,
        this.questions[startI + 1],
        this.questions[startI]
      )
    },
    async save() {
      this.saved = true
      const { id } = await this.$axios.$put(`/api/quiz/${this.id}`, {
        title: this.title,
        questions: this.questions
      })
      if (id !== null) {
        this.$router.push({
          path: `/quiz/${id}/edit`
        })
      }
    },
    async publish() {
      const tests = {
        'The title must not be empty': this.title === '',
        'There must not be any questions that are empty': this.questions.some(
          (question) => question.question === ''
        ),
        'There must be at least one question': this.questions.length === 0,
        'Each question must have at least one answer': this.questions.some(
          (question) => question.answers.length === 0
        ),
        'Each single or multiple answer question must have at least one correct answer': this.questions.some(
          (question) =>
            question.type !== 'Text answer question' &&
            !question.answers.some((answer) => answer.isCorrect)
        ),
        'There must not be any answers that are empty': this.questions.some(
          (question) => question.answers.some((answer) => answer.answer === '')
        )
      }

      const passedTests = Object.keys(tests).filter((test) => tests[test])

      if (passedTests.length !== 0) {
        this.$buefy.dialog.alert({
          title: 'Error',
          message: passedTests.join('<br>'),
          type: 'is-danger',
          ariaRole: 'alertdialog',
          ariaModal: true
        })
        return false
      }

      const { done } = await this.$axios.$post(`/api/quiz/${this.id}`)

      if (done) {
        this.$router.push({
          path: `/search`,
          query: {
            isUser: 'true'
          }
        })
      }
    }
  }
}
</script>
