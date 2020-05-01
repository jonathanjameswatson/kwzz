import { database, queries } from '../db.js'
import { shuffle } from '../utilities.js'

import express from 'express'
import asyncHandler from 'express-async-handler'

const router = new express.Router()

// This route will fetch a set of quizzes
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { offset, limit, isUser, searchString } = req.query

    const db = await database.get()
    const userId = req.user.id

    const quizzes = await db.any(queries.quiz.fetchQuizzes, {
      offset,
      limit,
      isUser,
      searchString,
      userId
    })

    res.json({ quizzes, total: quizzes[0].total })

    await db.close()
  })
)

// This route will fetch a single quiz from its ID
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params

    if (id === '0') {
      res.json({
        title: 'Untitled Quiz',
        questions: [
          {
            question: '',
            type: 'Single answer question',
            shuffle: true,
            answers: [
              {
                answer: '',
                isCorrect: true
              },
              {
                answer: '',
                isCorrect: false
              }
            ],
            topics: []
          }
        ]
      })
    } else {
      const db = await database.get()
      const userId = req.user.id

      const quiz = await db.one(queries.quiz.fetchQuiz, { userId, id })

      res.json({
        title: quiz.Title,
        questions: JSON.parse(quiz.Questions)
      })

      await db.close()
    }
  })
)

// This route will update a quiz if an ID is given
// or create the quiz and give it an ID
router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params
    const { title, questions } = req.body

    const questionsJson = JSON.stringify(questions)

    const db = await database.get()
    const userId = req.user.id

    if (id === '0') {
      const { lastId } = await db.one(queries.quiz.createQuiz, {
        title,
        questionsJson,
        userId
      })

      res.json({
        id: lastId
      })
    } else {
      await db.none(queries.quiz.updateQuiz, {
        title,
        questionsJson,
        userId,
        id
      })

      res.json({
        id: null
      })
    }

    await db.close()
  })
)

// This route will publish the quiz at the given ID
router.post(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params

    const db = await database.get()
    const userId = req.user.id

    await db.none(queries.quiz.publishQuiz, { userId, id })

    res.json({
      done: true
    })

    await db.close()
  })
)

// This route will fetch all questions for a quiz
// at a given ID
router.get(
  '/:id/questions',
  asyncHandler(async (req, res) => {
    const { id } = req.params

    const db = await database.get()
    const userId = req.user.id

    const quiz = await db.one(queries.quiz.fetchQuestions, { id, userId })

    const questions = JSON.parse(quiz.Questions)

    const justQuestions = questions.map((question) => {
      if (question.type !== 'Text answer question') {
        const newAnswers = question.answers.map((answer, i) => [
          answer.answer,
          i
        ])

        if (question.shuffle === false) {
          shuffle(newAnswers)
        }

        return {
          question: question.question,
          type: question.type,
          answers: newAnswers
        }
      }
      return {
        question: question.question,
        type: question.type
      }
    })

    res.json({ title: quiz.Title, questions: justQuestions })

    await db.close()
  })
)

export default router
