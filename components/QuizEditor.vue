<template>
  <div>
    <header class="block">
      <OField label="Quiz title">
        <OInput v-model="quiz.title" size="large" maxlength="50" required />
      </OField>
    </header>

    <div class="columns is-multiline">
      <div
        v-for="(question, i) in quiz.questions"
        :key="i"
        class="column is-full"
      >
        <QuestionEditor
          :model-value="question"
          :number="i + 1"
          @update:model-value="(value) => setQuestion(i, value)"
          @remove-question="removeQuestion(i)"
          @swap-question="
            (shouldSwapDown) => swapQuestions(shouldSwapDown ? i : i - 1)
          "
        />
      </div>
    </div>

    <hr />

    <div ref="bottomButtons" class="buttons">
      <OButton icon-right="plus" @click="addQuestion()"> Add question </OButton>
      <OButton icon-right="content-save" :disabled="isSaved" @click="save()">
        Save quiz
      </OButton>
      <KwzzLink link="play" disabled>
        <span>View quiz</span>
        <OIcon icon="eye" size="small" />
      </KwzzLink>
      <OButton icon-right="publish" :disabled="!isSaved" @click="publish()">
        Publish quiz
      </OButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Questions } from '~/types/questions.generated'
import type { Database } from '~/types/database.generated'

interface Quiz {
  title: string
  questions: Questions
}

const props = defineProps<{
  modelValue: Quiz
  id: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Quiz]
}>()

const [quiz, setQuiz] = useImmer(props.modelValue)
watch(props.modelValue, () => setQuiz(() => props.modelValue))
watch(quiz, () => emit('update:modelValue', quiz.value))

const setQuestion = (i: number, value: Questions[number]) => {
  setQuiz((draft) => {
    draft.questions[i] = value
  })
}

const removeQuestion = (i: number) => {
  setQuiz((draft) => {
    draft.questions.splice(i, 1)
  })
}

const swapQuestions = (i: number) => {
  if (i === -1 || i + 1 === quiz.value.questions.length) {
    return false
  }

  setQuiz((draft) => {
    draft.questions.splice(
      i,
      2,
      quiz.value.questions[i + 1],
      quiz.value.questions[i]
    )
  })
}

const isSaved = ref(true)
watch(quiz, () => {
  if (isSaved.value) {
    isSaved.value = false
  }
})

const oruga = useOruga()
const bottomButtons = ref<HTMLDivElement>()

const addQuestion = () => {
  if (quiz.value.questions.length === 25) {
    oruga.notification.open({
      message:
        'You have reached the maximum number of questions for this quiz.',
      position: 'bottom',
      variant: 'danger',
    })
    return false
  }
  setQuiz((draft) => {
    draft.questions.push({
      question: '',
      topics: [],
      answerType: 'singleChoice',
      answers: [
        {
          answer: '',
          isCorrect: true,
        },
        {
          answer: '',
          isCorrect: false,
        },
      ],
      shouldShuffle: true,
    })
  })
  if (bottomButtons.value) {
    bottomButtons.value.scrollIntoView()
  }
}

const supabaseClient = useSupabaseClient<Database>()

const save = async () => {
  isSaved.value = true
  await supabaseClient
    .from('quizzes')
    .update(quiz.value)
    .match({ id: props.id })
}

const publish = async () => {
  const validationTests = {
    'The title must not be empty': quiz.value.title === '',
    'There must not be any questions that are empty': quiz.value.questions.some(
      (question) => question.question === ''
    ),
    'There must be at least one question': quiz.value.questions.length === 0,
    'Each question must have at least one answer': quiz.value.questions.some(
      (question) => question.answers.length === 0
    ),
    'Each single or multiple answer question must have at least one correct answer':
      quiz.value.questions.some(
        (question) =>
          question.answerType !== 'text' &&
          !question.answers.some((answer) => answer.isCorrect)
      ),
    'There must not be any answers that are empty': quiz.value.questions.some(
      (question) => question.answers.some((answer) => answer.answer === '')
    ),
  } as const

  const passedTests = (
    Object.keys(validationTests) as Array<keyof typeof validationTests>
  ).filter((test) => validationTests[test])

  if (passedTests.length !== 0) {
    oruga.dialog.alert({
      title: 'Error',
      message: passedTests.join('<br>'),
      type: 'is-danger',
      ariaRole: 'alertdialog',
      ariaModal: true,
    })
    return false
  }

  const { error } = await supabaseClient
    .from('quizzes')
    .update({ is_published: true })
    .match({ id: props.id })

  if (!error) {
    navigateTo({
      path: `/search`,
      query: {
        isUser: 'true',
      },
    })
  }
}
</script>