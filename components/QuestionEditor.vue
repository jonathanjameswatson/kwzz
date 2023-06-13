<template>
  <article class="card">
    <div class="card-content">
      <OField :label="`Question ${number}`">
        <OInput
          v-model="question.question"
          size="medium"
          type="textarea"
          maxlength="200"
          rounded
        />
      </OField>

      <OField grouped group-multiline>
        <div class="control">
          <ODropdown v-model="question.answerType" aria-role="list">
            <template #trigger>
              <OTooltip :label="tooltip" multiline animated>
                <OButton rounded icon-right="menu-down">
                  {{ formattedAnswerType }}
                </OButton>
              </OTooltip>
            </template>

            <ODropdownItem
              v-for="answerType in answerTypes"
              :key="answerType"
              aria-role="listitem"
              :value="answerType"
            >
              {{ answerTypeToDescription[answerType] }}
            </ODropdownItem>
          </ODropdown>
        </div>

        <OField class="mb-3 is-expanded">
          <OInputitems
            v-model="question.topics"
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
          v-if="question.answerType !== 'text'"
          v-model="question.shouldShuffle"
          rounded
        >
          <OIcon :icon="question.shouldShuffle ? 'close' : 'check'" />
          <span>Shuffle answers?</span>
        </ToggleButton>
      </OField>

      <OTable :data="question.answers">
        <OTableColumn
          v-slot="{ row }"
          field="isCorrect"
          label="Correct?"
          width="0"
          centered
          :visible="question.answerType !== 'text'"
        >
          <OCheckbox v-model="row.isCorrect" size="large" />
        </OTableColumn>

        <OTableColumn v-slot="{ row }" field="answer" label="Answer">
          <OField expanded>
            <OInput
              v-model="row.answer"
              placeholder="Answer"
              maxlength="50"
              :has-counter="false"
            />
          </OField>
        </OTableColumn>

        <OTableColumn v-slot="{ index }" label="Delete" width="0" centered>
          <span>
            <OButton icon-right="minus" rounded @click="removeAnswer(index)" />
          </span>
        </OTableColumn>

        <template #footer>
          <div class="buttons">
            <OButton icon-right="plus" @click="addAnswer()">
              Add answer
            </OButton>
            <OButton
              icon-right="arrow-up"
              @click="$emit('swapQuestion', false)"
            >
              Move up
            </OButton>
            <OButton
              icon-right="arrow-down"
              @click="$emit('swapQuestion', true)"
            >
              Move down
            </OButton>
            <OButton icon-right="minus" @click="$emit('removeQuestion')">
              Delete question
            </OButton>
          </div>
        </template>
      </OTable>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Questions } from '~/types/database.generated'

const props = defineProps<{
  modelValue: Questions[0]
  number: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Questions[0]]
  swapQuestion: [shouldSwapDown: boolean]
  removeQuestion: []
}>()

const question = ref(props.modelValue)
watch(question, () => emit('update:modelValue', question.value), {
  deep: true,
})

const answerTypeToDescription = {
  singleChoice: 'Pick one answer',
  multipleChoice: 'Pick all answers',
  text: 'Type an answer',
} as const

const answerTypes = Object.keys(
  answerTypeToDescription
) as (keyof typeof answerTypeToDescription)[]

const formattedAnswerType = computed(
  () => answerTypeToDescription[props.modelValue.answerType]
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
  question.value.answers.push({
    answer: '',
    isCorrect: false,
  })
}

const removeAnswer = (i: number) => {
  question.value.answers.splice(i, 1)
}

const tooltip = `
  "Pick one answer" requires one correct answer to be picked.
  "Pick all answers" requires all correct answers to be picked.
  "Type an answer" requires the user to type in one of the answers.
`
</script>
