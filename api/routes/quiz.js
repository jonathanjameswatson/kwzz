import express from 'express'
import asyncHandler from 'express-async-handler'
import SQL from 'sql-template-strings'

import database from '../db.js'

const router = new express.Router()

// This route will fetch a set of quizzes
router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    const { offset, limit, isUser, searchString } = req.query

    const db = await database.get()

    let quizzes = null

    if (isUser === 'true') {
      quizzes = await db.all(SQL`
        SELECT Id, Title, Owner, IsPublished
        FROM quiz
        WHERE Owner = ${req.user.id}
          AND Title LIKE ${`%${searchString}%`}
        LIMIT ${limit} OFFSET ${offset}`)
    } else {
      quizzes = await db.all(SQL`
        SELECT Id, Title, Owner, IsPublished
        FROM quiz
        WHERE (IsPublished = 1
          OR Owner = ${req.user.id})
          AND Title LIKE ${`%${searchString}%`}
        LIMIT ${limit} OFFSET ${offset}`)
    }

    res.json({ quizzes })

    await db.close()
  })
)

// This route will fetch a single quiz from its ID
router.get(
  '/:id',
  asyncHandler(async (req, res, next) => {
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

      const quiz = await db.get(SQL`
        SELECT Title, Questions
        FROM quiz
        WHERE Owner = ${req.user.id}
          AND Id = ${id}
          AND IsPublished = 0`)

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
  asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { title, questions } = req.body

    const questionsJson = JSON.stringify(questions)

    const db = await database.get()

    if (id === '0') {
      const { lastID } = await db.run(SQL`
        INSERT INTO quiz
        (Title, Questions, Owner)
        VALUES
        (${title}, ${questionsJson}, ${req.user.id})`)

      res.json({
        id: lastID
      })
    } else {
      await db.run(SQL`
        UPDATE quiz
        SET Title = ${title},
          Questions = ${questionsJson}
        WHERE Owner = ${req.user.id}
          AND Id = ${id}
          AND IsPublished = 0`)

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
  asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const db = await database.get()

    await db.run(SQL`
    UPDATE quiz
    SET IsPublished = 1
    WHERE Owner = ${req.user.id}
      AND Id = ${id}
      AND IsPublished = 0`)

    res.json({
      done: true
    })

    await db.close()
  })
)

// This route will fetch all questions for a quiz
// at a given ID
router.get('/:id/questions', (req, res, next) => {})

export default router
