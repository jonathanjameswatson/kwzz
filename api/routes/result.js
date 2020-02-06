import express from 'express'
import asyncHandler from 'express-async-handler'
import SQL from 'sql-template-strings'

import database from '../db.js'
import { getPercentage } from '../utilities.js'

const router = new express.Router()

// This route will save a user's attempt at a quiz
router.post(
  '/:id',
  asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { answers, timeTaken } = req.body

    const db = await database.get()

    const quiz = await db.get(SQL`
      SELECT Questions
      FROM quiz
      WHERE Id = ${id}
        AND (Owner = ${req.user.id} OR IsPublished = 1)`)

    const questions = JSON.parse(quiz.Questions)

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
    const lastResult = await db.get(SQL`
      SELECT Score
      FROM result
      WHERE Quiz = ${id}
        AND User = ${req.user.id}
      ORDER BY MadeTimestamp DESC`)

    if (lastResult) {
      improvement = getPercentage(totalScore, lastResult.Score) - 100
    }

    const result = await db.run(SQL`
      INSERT INTO result
      (Quiz, User, Answers, Score, TimeTaken, Improvement)
      VALUES
      (${id},
        ${req.user.id},
        ${JSON.stringify(newAnswers)},
        ${totalScore},
        ${timeTaken},
        ${improvement})`)

    await Promise.all(
      Object.entries(topicCorrectCounts).map(async ([topic, correctCount]) => {
        const topicScore = getPercentage(correctCount, topicLengths[topic])
        return await db.run(SQL`
          INSERT INTO topicResult
          (Result, Topic, Score)
          VALUES
          (${result.lastID}, ${topic}, ${topicScore})`)
      })
    )

    res.json({
      done: true
    })

    await db.close()
  })
)

// This route will fetch all results of a quiz from its ID
router.get(
  '/quiz/:id',
  asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const db = await database.get()

    const results = await db.all(SQL`
      SELECT Id, Score, TimeTaken, Improvement
      FROM result
      WHERE Quiz = ${id}
        AND (User = ${req.user.id}
        OR (SELECT Owner FROM quiz WHERE Id=${id}) = ${req.user.id})
      ORDER BY MadeTimestamp DESC`)

    await Promise.all(
      results.map(async (result) => {
        result.topics = await db.all(SQL`
          SELECT Topic, Score
          FROM topicResult
          WHERE Result = ${result.Id}`)
        return true
      })
    )

    res.json({ results })

    await db.close()
  })
)

// This route will fetch an attempt from its ID
router.get(
  '/attempt/:id',
  asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const db = await database.get()

    const results = await db.get(SQL`
      SELECT Answers, Quiz, (SELECT Questions FROM quiz WHERE quiz.Id=result.Quiz) Questions
      FROM result
      WHERE Id = ${id}
        AND (User = ${req.user.id}
        OR (SELECT Owner FROM quiz WHERE Id=${id}) = ${req.user.id})
      ORDER BY MadeTimestamp DESC`)

    const answers = JSON.parse(results.Answers)
    const questions = JSON.parse(results.Questions)

    const correctAnswers = answers.map((answer, i) => {
      let correctAnswer = true
      if (!answer.isCorrect) {
        if (questions[i].type === 'Single answer question') {
          correctAnswer = questions[i].answers.findIndex(
            (possibleAnswer) => possibleAnswer.isCorrect
          )
        } else if (questions[i].type === 'Multiple answer question') {
          correctAnswer = questions[i].answers
            .map((possibleAnswer, i) => (possibleAnswer.isCorrect ? i : null))
            .filter((possibleAnswer) => possibleAnswer !== null)
        } else {
          correctAnswer = questions[i].answers.find(
            (possibleAnswer) => possibleAnswer.isCorrect
          ).answer
        }
      }

      return {
        userAnswer: answer.answer,
        correctAnswer
      }
    })

    res.json({ attempt: correctAnswers, quizId: results.Quiz })

    await db.close()
  })
)

// This route will publish the list of all results
// from all players on a quiz from its ID
router.get(
  '/players/:id',
  asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const db = await database.get()

    const attempts = await db.all(SQL`
      SELECT Id, Score, TimeTaken, (SELECT Username FROM user WHERE user.Id=result.User) Username
      FROM result
      WHERE Quiz = ${id}
        AND (SELECT Owner FROM quiz WHERE Id=${id}) = ${req.user.id}
      ORDER BY MadeTimestamp DESC`)

    res.json({ attempts })

    await db.close()
  })
)

export default router
