<template>
  <KwzzSection>
    <header class="block">
      <OField label="Quiz title">
        <OInput v-model="data.title" size="large" maxlength="50" required />
      </OField>
    </header>

    <div class="columns is-multiline">
      <div
        v-for="(question, i) in data.questions"
        :key="i"
        class="column is-full"
      >
        <QuestionEditor
          :question="question"
          :number="i + 1"
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
      <KwzzLink link="play">
        <span>View quiz</span>
        <OIcon icon="eye" size="small" />
      </KwzzLink>
      <OButton icon-right="publish" :disabled="!isSaved" @click="publish()">
        Publish quiz
      </OButton>
    </div>
  </KwzzSection>
</template>

<script setup lang="ts">
import type { Quizzes } from '~/types/database.generated'

const supabaseClient = useSupabaseClient()
const isSaved = ref(true)
const {
  params: { id: idParam },
} = useRoute()
const id = computed(() => (typeof idParam === 'string' ? parseInt(idParam) : 0))

const { data } = await useAsyncData('edit', async () => {
  const {
    data: { title, questions },
  } = await supabaseClient
    .from<Quizzes>('quizzes')
    .select('title, questions')
    .eq('id', parseInt(id.value.toString(), 10))
    .limit(1)
    .single()
  return {
    title,
    questions,
  }
})

watch(
  data,
  () => {
    if (isSaved.value) {
      isSaved.value = false
    }
  },
  { deep: true }
)

const oruga = useOruga()
const bottomButtons = ref<HTMLDivElement>()

const addQuestion = () => {
  if (data.value.questions.length === 25) {
    oruga.notification.open({
      message:
        'You have reached the maximum number of questions for this quiz.',
      position: 'bottom',
      variant: 'danger',
    })
    return false
  }
  data.value.questions.push({
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
  bottomButtons.value.scrollIntoView()
}

const removeQuestion = (i: number) => {
  data.value.questions.splice(i, 1)
}

const swapQuestions = (i: number) => {
  if (i === -1 || i + 1 === data.value.questions.length) {
    return false
  }

  data.value.questions.splice(
    i,
    2,
    data.value.questions[i + 1],
    data.value.questions[i]
  )
}

const save = async () => {
  isSaved.value = true
  await supabaseClient
    .from<Quizzes>('quizzes')
    .update(data.value)
    .match({ id: id.value })
}

const publish = async () => {
  const tests = {
    'The title must not be empty': data.value.title === '',
    'There must not be any questions that are empty': data.value.questions.some(
      (question) => question.question === ''
    ),
    'There must be at least one question': data.value.questions.length === 0,
    'Each question must have at least one answer': data.value.questions.some(
      (question) => question.answers.length === 0
    ),
    'Each single or multiple answer question must have at least one correct answer':
      data.value.questions.some(
        (question) =>
          question.answerType !== 'text' &&
          !question.answers.some((answer) => answer.isCorrect)
      ),
    'There must not be any answers that are empty': data.value.questions.some(
      (question) => question.answers.some((answer) => answer.answer === '')
    ),
  }

  const passedTests = Object.keys(tests).filter((test) => tests[test])

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
    .from<Quizzes>('quizzes')
    .update({ is_published: true })
    .match({ id: id.value })

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
