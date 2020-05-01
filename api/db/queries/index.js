import path from 'path'
import { QueryFile } from 'pg-promise'

const sql = (file) => {
  const fullPath = path.join(__dirname, file) // generating full path;

  const options = { minify: true }

  const queryFile = new QueryFile(fullPath, options)

  if (queryFile.error) {
    // eslint-disable-next-line no-console
    console.error(queryFile.error)
  }

  return queryFile
}

export default {
  quiz: {
    editFetchQuiz: sql('quiz/editFetchQuiz'),
    createQuiz: sql('quiz/createQuiz')
  },
  result: {},
  topicResult: {},
  user: {}
}
