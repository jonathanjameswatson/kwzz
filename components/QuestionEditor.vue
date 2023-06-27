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
          <ODropdown v-model="answerType" aria-role="list">
            <template #trigger>
              <OTooltip :label="tooltip" multiline animated>
                <OButton rounded icon-right="menu-down">
                  {{ formattedAnswerType }}
                </OButton>
              </OTooltip>
            </template>

            <ODropdownItem
              v-for="answerTypeOption in answerTypes"
              :key="answerTypeOption"
              aria-role="listitem"
              :value="answerTypeOption"
            >
              {{ answerTypeToDescription[answerTypeOption] }}
            </ODropdownItem>
          </ODropdown>
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

        <ToggleButton
          v-if="answerType !== 'text'"
          v-model="shouldShuffle"
          rounded
        >
          Shuffle answers?
        </ToggleButton>
      </OField>

      <div class="mb-3">
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
  modelValue: Questions[0]
  number: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Questions[0]]
  swapQuestion: [shouldSwapDown: boolean]
  removeQuestion: []
}>()

const [question, internalSetQuestion] = useImmer(props.modelValue)
watch(
  () => props.modelValue,
  () => internalSetQuestion(() => props.modelValue)
)
const setQuestion = (f: Updater<Questions[0]>) => {
  internalSetQuestion(f)
  emit('update:modelValue', question.value)
}

const questionText = computed({
  get() {
    return question.value.question
  },
  set(question: string) {
    setQuestion((draft) => {
      draft.question = question
    })
  },
})

const answerTypeToDescription = {
  singleChoice: 'Pick one answer',
  multipleChoice: 'Pick all answers',
  text: 'Type an answer',
} as const

const answerTypes = Object.keys(
  answerTypeToDescription
) as (keyof typeof answerTypeToDescription)[]

const answerType = computed({
  get() {
    return question.value.answerType
  },
  set(answerType: (typeof answerTypes)[number]) {
    setQuestion((draft) => {
      draft.answerType = answerType
    })
  },
})

const formattedAnswerType = computed(
  () => answerTypeToDescription[answerType.value]
)

const oruga = useOruga()

const addAnswer = () => {
  if (question.value.answers.length === 10) {
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
    return question.value.topics
  },
  set(topics: string[]) {
    setQuestion((draft) => {
      draft.topics = topics
    })
  },
})

const shouldShuffle = computed({
  get() {
    return question.value.shouldShuffle
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
