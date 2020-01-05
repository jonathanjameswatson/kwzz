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
router.get('/:id', (req, res, next) => {})

// This route will update a quiz if an ID is given
// or create the quiz and give it an ID
router.put('/', (req, res, next) => {})

// This route will publish the quiz at the given ID
router.post('/', (req, res, next) => {})

// This route will fetch all questions for a quiz
// at a given ID
router.get('/:id/questions', (req, res, next) => {})

export default router
