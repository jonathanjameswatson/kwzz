<template>
  <div class="section">
    <b-field label="Quiz title">
      <b-input size="is-large" maxlength="50" v-model="title"/>
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
                  <b-button
                    type="is-primary"
                    icon-right="menu-down"
                    rounded
                    outlined
                    slot="trigger"
                    maxlength="30"
                  >{{ question.type }}</b-button>

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
                placeholder="Add a tag and press enter"
                type="is-primary"
                expanded
                maxlength="30"
                maxtags="10"
                :has-counter="false"
                v-model="question.topics"
              />

              <b-checkbox-button type="is-primary" v-model="question.shuffle">Shuffle answers?</b-checkbox-button>
            </b-field>

            <b-table :data="question.answers">
              <template slot-scope="props">
                <b-table-column field="isCorrect" label="Correct?" width="0" centered>
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
                      size="is-small"
                      @click="removeAnswer(i, props.row.i)"
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
                    icon-right="minus"
                    rounded
                    outlined
                    @click="removeQuestion(i)"
                  >Delete question</b-button>
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
                </div>
              </template>
            </b-table>
          </div>
        </div>
      </div>
    </div>

    <hr>

    <div class="buttons">
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
      >Save quiz</b-button>
      <k-link icon-right="eye" link="view">View quiz</k-link>
      <b-button
        type="is-primary"
        icon-right="publish"
        rounded
        outlined
        @click="publish()"
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
      id
    }
  },
  components: { kLink },
  methods: {
    addQuestion() {
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
    },
    addAnswer(i) {
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
    save() {},
    publish() {}
  }
}
</script>
