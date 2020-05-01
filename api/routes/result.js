import { db, queries } from '../db'
import { getPercentage } from '../utilities.js'

import express from 'express'
import asyncHandler from 'express-async-handler'

const router = new express.Router()

// This route will save a user's attempt at a quiz
router.post(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params
    const { answers, timeTaken } = req.body
    const userId = req.user.id

    const quiz = await db.one(queries.quiz.fetchQuestions, { id, userId })

    const questions = JSON.parse(quiz.questions)

    let totalCorrectCount = 0
    const topicCorrectCounts = {}
    const topicLengths = {}
    const newAnswers = []

    answers.forEach((answer, i) => {
      questions[i].topics.forEach((topic) => {
        if (!topicCorrectCounts[topic]) {
          topicLengths[topic] = 1
          topicCorrectCounts[topic] = 0
        } else {
          topicLengths[topic] += 1
        }
      })

      let isCorrect
      if (questions[i].type === 'Single answer question') {
        isCorrect = questions[i].answers[answer].isCorrect
      } else if (questions[i].type === 'Multiple answer question') {
        isCorrect = questions[i].answers.every(
          (possibleAnswer, answerIndex) =>
            possibleAnswer.isCorrect === answer.includes(answerIndex)
        )
      } else {
        isCorrect = questions[i].answers.some(
          (possibleAnswer) => possibleAnswer.answer === answer
        )
      }

      if (isCorrect) {
        totalCorrectCount += 1
        questions[i].topics.forEach((topic) => (topicCorrectCounts[topic] += 1))
      }

      newAnswers.push({ answer, isCorrect })
    })

    const totalScore = getPercentage(totalCorrectCount, questions.length)

    let improvement = null
    const lastResult = await db.oneOrNone(queries.result.fetchLastScore, {
      id,
      userId
    })

    if (lastResult) {
      improvement = getPercentage(totalScore, lastResult.score) - 100
    }
    const { resultId } = await db.one(queries.result.createResult, {
      id,
      userId,
      newAnswers: JSON.stringify(newAnswers),
      totalScore,
      timeTaken,
      improvement
    })

    await Promise.all(
      Object.entries(topicCorrectCounts).map(([topic, correctCount]) => {
        const topicScore = getPercentage(correctCount, topicLengths[topic])
        return db.none(queries.topicResult.createTopicResult, {
          resultId,
          topic,
          topicScore
        })
      })
    )

    res.json({
      done: true
    })
  })
)

// This route will fetch all results of a quiz from its ID
router.get(
  '/quiz/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params
    const userId = req.user.id

    const results = await db.one(queries.result.fetchResult, { id, userId })

    await Promise.all(
      results.map(async (result) => {
        const { id: resultId } = result
        result.topics = await db.one(queries.topicResult.fetchTopicResults, {
          resultId
        })
        return true
      })
    )

    res.json({ results })
  })
)

// This route will fetch an attempt from its ID
router.get(
  '/attempt/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params
    const userId = req.user.id

    const results = await db.one(queries.result.fetchAttempt, { id, userId })

    const answers = JSON.parse(results.answers)
    const questions = JSON.parse(results.questions)

    const attempt = answers.map((answer, i) => {
      const userAnswer = [answer.answer]
        .reduce((acc, val) => acc.concat(val), [])
        .map((answer) => {
          if (questions[i].type !== 'Text answer question') {
            return questions[i].answers[answer].answer
          } else {
            return answer
          }
        })
        .join(', ')

      let correctAnswer = true
      if (!answer.isCorrect) {
        if (questions[i].type === 'Single answer question') {
          correctAnswer = questions[i].answers.find(
            (possibleAnswer) => possibleAnswer.isCorrect
          ).answer
        } else if (questions[i].type === 'Multiple answer question') {
          correctAnswer = questions[i].answers
            .filter((possibleAnswer) => possibleAnswer.isCorrect)
            .map((answer) => answer.answer)
            .join(', ')
        } else {
          correctAnswer = questions[i].answers.find(
            (possibleAnswer) => possibleAnswer.isCorrect
          ).answer
        }
      }

      return {
        userAnswer,
        correctAnswer
      }
    })

    res.json({ attempt, quizId: results.Quiz })
  })
)

// This route will publish the list of all results
// from all players on a quiz from its ID
router.get(
  '/players/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params
    const userId = req.user.id

    const attempts = await db.any(queries.result.fetchPlayers, { id, userId })

    res.json({ attempts })
  })
)

export default router
