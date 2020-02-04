<template>
  <div class="section">
    <b-field label="Quiz title">
      <b-input size="is-large" maxlength="50" v-model="title" required/>
    </b-field>

    <div class="columns is-multiline">
      <div v-for="(question, i) in questions" :key="i" class="column is-full">
        <div class="card">
          <div class="card-content">
            <b-field :label="`Question ${i + 1}`">
              <b-input
                size="is-medium"
                type="textarea"
                maxlength="200"
                v-model="question.question"
              />
            </b-field>

            <b-field grouped group-multiline>
              <div class="control">
                <b-dropdown aria-role="list" v-model="question.type">
                  <b-tooltip
                    label="Single answer requires one correct answer to be picked. Multiple answer requires each correct answer to be picked. Text answer requires one answer to be typed in."
                    multilined
                    animated
                    type="is-dark"
                    slot="trigger"
                  >
                    <b-button
                      type="is-primary"
                      icon-right="menu-down"
                      rounded
                      outlined
                    >{{ question.type }}</b-button>
                  </b-tooltip>

                  <b-dropdown-item
                    aria-role="listitem"
                    value="Single answer question"
                  >Single answer question</b-dropdown-item>
                  <b-dropdown-item
                    aria-role="listitem"
                    value="Multiple answer question"
                  >Multiple answer action</b-dropdown-item>
                  <b-dropdown-item
                    aria-role="listitem"
                    value="Text answer question"
                  >Text answer question</b-dropdown-item>
                </b-dropdown>
              </div>

              <b-taginput
                ellipsis
                icon="label"
                placeholder="Add a topic and press enter"
                type="is-primary"
                expanded
                maxlength="30"
                maxtags="10"
                :has-counter="false"
                v-model="question.topics"
                rounded
              />

              <b-checkbox-button type="is-primary" v-model="question.shuffle">
                <b-icon :icon="question.shuffle ? 'close' : 'check'"/>
                <span>Shuffle answers?</span>
              </b-checkbox-button>
            </b-field>

            <b-table :data="question.answers">
              <template slot-scope="props">
                <b-table-column
                  field="isCorrect"
                  label="Correct?"
                  width="0"
                  centered
                  :visible="question.type !== 'Text answer question'"
                >
                  <b-checkbox size="is-medium" type="is-dark" v-model="props.row.isCorrect"/>
                </b-table-column>

                <b-table-column field="answer" label="Answer">
                  <b-input
                    placeholder="Answer"
                    rounded
                    expanded
                    maxlength="50"
                    :has-counter="false"
                    v-model="props.row.answer"
                  />
                </b-table-column>

                <b-table-column field="delete" label="Delete" width="0" centered>
                  <span>
                    <b-button
                      type="is-primary"
                      outlined
                      icon-right="minus"
                      size="is-default"
                      @click="removeAnswer(i, props.index)"
                    />
                  </span>
                </b-table-column>
              </template>

              <template slot="footer">
                <div class="buttons">
                  <b-button
                    type="is-primary"
                    icon-right="plus"
                    rounded
                    outlined
                    @click="addAnswer(i)"
                  >Add answer</b-button>
                  <b-button
                    type="is-primary"
                    icon-right="arrow-up"
                    rounded
                    outlined
                    @click="swapQuestions(i - 1)"
                  >Move up</b-button>
                  <b-button
                    type="is-primary"
                    icon-right="arrow-down"
                    rounded
                    outlined
                    @click="swapQuestions(i)"
                  >Move down</b-button>
                  <b-button
                    type="is-primary"
                    icon-right="minus"
                    rounded
                    outlined
                    @click="removeQuestion(i)"
                  >Delete question</b-button>
                </div>
              </template>
            </b-table>
          </div>
        </div>
      </div>
    </div>

    <hr>

    <div class="buttons" ref="bottom">
      <b-button
        type="is-primary"
        icon-right="plus"
        rounded
        outlined
        @click="addQuestion()"
      >Add question</b-button>
      <b-button
        type="is-primary"
        icon-right="content-save"
        rounded
        outlined
        @click="save()"
        :disabled="saved"
      >Save quiz</b-button>
      <k-link link="play" :broken="id === '0'">
        <span>View quiz</span>
        <b-icon icon="eye" size="is-small"/>
      </k-link>
      <b-button
        type="is-primary"
        icon-right="publish"
        rounded
        outlined
        @click="publish()"
        :disabled="!saved || id === '0'"
      >Publish quiz</b-button>
    </div>
  </div>
</template>

<script>
import kLink from '~/components/kLink'

export default {
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
  components: { kLink },
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
      const { id } = await this.$axios.$put(`/api/quiz/${this.id}`, {
        title: this.title,
        questions: this.questions
      })
      if (id !== null) {
        this.$router.push({
          path: `/quiz/${id}/edit`
        })
      }
      this.saved = true
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
  }
}
</script>
