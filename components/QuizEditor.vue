<template>
  <div>
    <header class="block">
      <OField label="Quiz title">
        <OInput v-model="title" size="large" maxlength="50" required />
      </OField>
    </header>

    <div ref="questionCardContainer" class="columns is-multiline">
      <div
        v-for="(question, i) in quiz.questions"
        :key="i"
        class="column is-full"
      >
        <QuestionEditor
          :question="question"
          :number="i + 1"
          @update-question="(f) => updateQuestion(i, f)"
          @remove-question="removeQuestion(i)"
          @swap-question="
            (shouldSwapDown) => swapQuestions(shouldSwapDown ? i : i - 1)
          "
        />
      </div>
    </div>

    <div class="quiz-editor-buttons-sticky">
      <div class="quiz-editor-buttons-relative">
        <div class="container">
          <div class="buttons">
            <OButton icon-right="plus" @click="addQuestion()">
              Add question
            </OButton>
            <OButton
              icon-right="content-save"
              :disabled="isSaved"
              @click="save()"
            >
              Save quiz
            </OButton>
            <KwzzLink link="play" disabled>
              <span>View quiz</span>
              <OIcon icon="eye" size="small" />
            </KwzzLink>
            <OButton
              icon-right="publish"
              :disabled="!isSaved"
              @click="publish()"
            >
              Publish quiz
            </OButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Questions } from '~/types/questions.generated'
import type { Database } from '~/types/database.generated'
import type { Updater } from '~/composables/useImmer'

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

const debounce = ref(false)
const [quiz, internalSetQuiz] = useImmer(props.modelValue)
watch(
  () => props.modelValue,
  () => {
    if (debounce.value) {
      debounce.value = false
      return
    }
    internalSetQuiz(() => props.modelValue)
  }
)
const setQuiz = (f: Updater<Quiz>) => {
  internalSetQuiz(f)
  debounce.value = true
  emit('update:modelValue', quiz.value)
}

const title = computed({
  get() {
    return quiz.value.title
  },
  set(value: string) {
    setQuiz((draft) => {
      draft.title = value
    })
  },
})

const updateQuestion = (i: number, f: Updater<Questions[0]>) => {
  setQuiz((draft) => {
    f(draft.questions[i])
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
const questionCardContainer = ref<HTMLDivElement>()

const addQuestion = async () => {
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
    const newQuestion = {
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
    } as Questions[0]
    markRaw(newQuestion)
    markRaw(newQuestion.answers)
    draft.questions.push(newQuestion)
  })

  await nextTick()
  const questionCardContainerValue = questionCardContainer.value
  if (
    questionCardContainerValue &&
    questionCardContainerValue.children.length > 0
  ) {
    questionCardContainerValue.children[
      questionCardContainerValue.children.length - 1
    ].scrollIntoView({ behavior: 'smooth' })
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
      (question: Questions[0]) => question.question === ''
    ),
    'There must be at least one question': quiz.value.questions.length === 0,
    'Each question must have at least one answer': quiz.value.questions.some(
      (question: Questions[0]) => question.answers.length === 0
    ),
    'Each single or multiple answer question must have at least one correct answer':
      quiz.value.questions.some(
        (question: Questions[0]) =>
          question.answerType !== 'text' &&
          !question.answers.some((answer) => answer.isCorrect)
      ),
    'There must not be any answers that are empty': quiz.value.questions.some(
      (question: Questions[0]) =>
        question.answers.some((answer) => answer.answer === '')
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
    await navigateTo({
      path: `/search`,
      query: {
        user: '',
      },
    })
  }
}
</script>

<style scoped lang="scss">
@use '~/assets/scss/config' as config;
@use 'bulma/sass/utilities/mixins' as mixins;

.quiz-editor-buttons-sticky {
  position: sticky;
  bottom: 0;
  z-index: 8;
}

.quiz-editor-buttons-relative {
  position: relative;
  width: 100vw;
  background-color: white;
  padding: 1rem 1.5rem;
  border-top: 1px solid config.$primary;
  overflow-x: auto;

  @include mixins.touch {
    left: -1.5rem;
    right: -1.5rem;
  }

  @include mixins.desktop {
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
  }
}
</style>
