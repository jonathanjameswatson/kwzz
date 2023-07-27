<template>
  <article class="card">
    <div class="card-content">
      <OField :label="`Question ${number}`">
        <OInput
          v-model="questionText"
          size="medium"
          type="textarea"
          maxlength="200"
          rounded
        />
      </OField>

      <OField grouped group-multiline>
        <div class="control">
          <OptionDropdown v-model="answerType" :options="answerTypeOptions">
            <template #trigger>
              <OTooltip :label="tooltip" multiline animated>
                <OButton rounded icon-right="menu-down">
                  {{ answerTypeOptions.get(answerType) }}
                </OButton>
              </OTooltip>
            </template>
          </OptionDropdown>
        </div>

        <OField class="mb-3 is-expanded">
          <OInputitems
            v-model="topics"
            ellipsis
            icon="label"
            close-icon=""
            placeholder="Add a topic and press enter"
            aria-close-label="Delete this tag"
            maxlength="30"
            maxitems="10"
            :has-counter="false"
            variant="primary"
          />
        </OField>

        <div class="control">
          <OptionDropdown
            v-model="shouldShuffle"
            :options="shouldShuffleOptions"
          />
        </div>
      </OField>

      <div class="mb-4">
        <ClientOnly>
          <OTable :data="question.answers">
            <OTableColumn
              v-slot="{ row, index }"
              field="isCorrect"
              label="Correct?"
              width="0"
              centered
              :visible="answerType !== 'text'"
            >
              <OCheckbox
                :model-value="row.isCorrect"
                size="large"
                class="question-answer-checkbox"
                @update:model-value="(x: boolean) => updateIsCorrect(index, x)"
              />
            </OTableColumn>

            <OTableColumn v-slot="{ row, index }" field="answer" label="Answer">
              <OField class="is-expanded">
                <OInput
                  :model-value="row.answer"
                  placeholder="Answer"
                  maxlength="50"
                  :has-counter="false"
                  @update:model-value="(x: string) => updateAnswerText(index, x)"
                />
              </OField>
            </OTableColumn>

            <OTableColumn v-slot="{ index }" label="Delete" width="0" centered>
              <span>
                <OButton
                  icon-right="minus"
                  rounded
                  @click="removeAnswer(index)"
                />
              </span>
            </OTableColumn>
          </OTable>
        </ClientOnly>
      </div>

      <div>
        <div class="buttons">
          <OButton icon-right="plus" @click="addAnswer()">Add answer</OButton>
          <OButton icon-right="arrow-up" @click="$emit('swapQuestion', false)">
            Move up
          </OButton>
          <OButton icon-right="arrow-down" @click="$emit('swapQuestion', true)">
            Move down
          </OButton>
          <OButton icon-right="minus" @click="$emit('removeQuestion')">
            Delete question
          </OButton>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Questions } from '~/types/questions.generated'
import type { Updater } from '~/composables/useImmer'

const props = defineProps<{
  question: Questions[0]
  number: number
}>()

const emit = defineEmits<{
  updateQuestion: [updater: Updater<Questions[0]>]
  swapQuestion: [shouldSwapDown: boolean]
  removeQuestion: []
}>()

const setQuestion = (f: Updater<Questions[0]>) => {
  emit('updateQuestion', f)
}

const questionText = computed({
  get() {
    return props.question.question
  },
  set(question: string) {
    setQuestion((draft) => {
      draft.question = question
    })
  },
})

const answerTypeOptions = new Map<Questions[0]['answerType'], string>([
  ['singleChoice', 'Pick one answer'],
  ['multipleChoice', 'Pick all answers'],
  ['text', 'Type an answer'],
])

const answerType = computed({
  get() {
    return props.question.answerType
  },
  set(answerType: Questions[0]['answerType']) {
    setQuestion((draft) => {
      draft.answerType = answerType
    })
  },
})

const oruga = useOruga()

const addAnswer = () => {
  if (props.question.answers.length === 10) {
    oruga.notification.open({
      message:
        'You have reached the maximum number of answers for this question.',
      position: 'bottom',
      variant: 'danger',
    })
    return false
  }
  setQuestion((draft) => {
    draft.answers.push({
      answer: '',
      isCorrect: false,
    })
  })
  return true
}

const removeAnswer = (i: number) => {
  setQuestion((draft) => {
    draft.answers.splice(i, 1)
  })
}

const tooltip = `
  "Pick one answer" requires one correct answer to be picked.
  "Pick all answers" requires all correct answers to be picked.
  "Type an answer" requires the user to type in one of the answers.
`

const topics = computed({
  get() {
    return props.question.topics
  },
  set(topics: string[]) {
    setQuestion((draft) => {
      draft.topics = topics
    })
  },
})

const shouldShuffleOptions = new Map([
  [true, 'Shuffle answers'],
  [false, 'Show answers in order'],
])

const shouldShuffle = computed({
  get() {
    return props.question.shouldShuffle
  },
  set(shouldShuffle: boolean) {
    setQuestion((draft) => {
      draft.shouldShuffle = shouldShuffle
    })
  },
})

const updateIsCorrect = (i: number, isCorrect: boolean) => {
  setQuestion((draft) => {
    draft.answers[i].isCorrect = isCorrect
  })
}

const updateAnswerText = (i: number, answer: string) => {
  setQuestion((draft) => {
    draft.answers[i].answer = answer
  })
}
</script>

<style scoped lang="scss">
.question-answer-checkbox {
  margin-right: 0 !important;

  &:deep(.control-label) {
    padding-left: 0 !important;
  }
}
</style>
