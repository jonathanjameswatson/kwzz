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
              v-for="answerType in Object.keys(answerTypeToDescription)"
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
            closeIcon=""
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
          v-slot="props"
          field="isCorrect"
          label="Correct?"
          width="0"
          centered
          :visible="question.answerType !== 'text'"
        >
          <OCheckbox v-model="props.row.isCorrect" size="large" />
        </OTableColumn>

        <OTableColumn v-slot="props" field="answer" label="Answer">
          <OField expanded>
            <OInput
              v-model="props.row.answer"
              placeholder="Answer"
              maxlength="50"
              :has-counter="false"
            />
          </OField>
        </OTableColumn>

        <OTableColumn v-slot="props" label="Delete" width="0" centered>
          <span>
            <OButton
              icon-right="minus"
              rounded
              @click.native="removeAnswer(props.index)"
            />
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
  question: Questions[0]
  number: number
}>()

const emits = defineEmits<{
  (e: 'swapQuestion', shouldSwapDown: boolean): void
  (e: 'removeQuestion'): void
}>()

const answerTypeToDescription = {
  singleChoice: 'Pick one answer',
  multipleAnswer: 'Pick all answers',
  text: 'Type an answer',
}

const formattedAnswerType = computed(
  () => answerTypeToDescription[props.question.answerType]
)

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
  props.question.answers.push({
    answer: '',
    isCorrect: false,
  })
}

const removeAnswer = (i: number) => {
  props.question.answers.splice(i, 1)
}

const tooltip = `
  "Pick one answer" requires one correct answer to be picked.
  "Pick all answers" requires all correct answers to be picked.
  "Type an answer" requires the user to type in one of the answers.
`
</script>
