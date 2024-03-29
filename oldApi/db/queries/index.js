import path from 'path'
import { QueryFile } from 'pg-promise'

const sql = (file) => {
  const fullPath = path.join(__dirname, `${file}.sql`) // generating full path;

  const options = { minify: true }

  const queryFile = new QueryFile(fullPath, options)

  if (queryFile.error) {
    // eslint-disable-next-line no-console
    console.error(queryFile.error)
  }

  return queryFile
}

export const queries = {
  quiz: {
    fetchQuizzes: sql('quiz/fetchQuizzes'),
    fetchQuiz: sql('quiz/fetchQuiz'),
    createQuiz: sql('quiz/createQuiz'),
    updateQuiz: sql('quiz/updateQuiz'),
    publishQuiz: sql('quiz/publishQuiz'),
    fetchQuestions: sql('quiz/fetchQuestions'),
  },
  result: {
    fetchLastScore: sql('result/fetchLastScore'),
    createResult: sql('result/createResult'),
    fetchResults: sql('result/fetchResults'),
    fetchAttempt: sql('result/fetchAttempt'),
    fetchPlayers: sql('result/fetchPlayers'),
  },
  topicResult: {
    createTopicResult: sql('topicResult/createTopicResult'),
    fetchTopicResults: sql('topicResult/fetchTopicResults'),
  },
}
