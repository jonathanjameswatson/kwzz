import { db, queries } from '../db.js'

import express from 'express'
import asyncHandler from 'express-async-handler'
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const router = new express.Router()

// This route will fetch the user's data
router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { username, password } = req.body
    const passwordHash = await bcrypt.hash(password, 12)

    try {
      await await db.none(queries.user.createUser, { username, passwordHash })
    } catch (e) {
      throw new Error('This username is already taken.')
    }

    res.json({
      done: true
    })
  })
)

// This route will verify the user and give them a JWT
router.post(
  '/signin',
  asyncHandler(async (req, res) => {
    const secret = process.env.JWT_SECRET || 'jwtSecret'

    const { username, password } = req.body

    const user = await db.oneOrNone(queries.user.fetchUser, { username })

    if (user === null) {
      throw new Error('Invalid username or password')
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      throw new Error('Invalid username or password')
    }

    const accessToken = jsonwebtoken.sign(
      {
        username,
        id: user.id
      },
      secret
    )

    res.json({
      token: {
        accessToken
      }
    })
  })
)

// This route will fetch the user's data
router.get('/', (req, res) => {
  res.json({ user: req.user })
})

export default router
