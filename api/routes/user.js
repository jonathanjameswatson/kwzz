import express from 'express'
import asyncHandler from 'express-async-handler'
import SQL from 'sql-template-strings'
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import database from '../db.js'

const router = new express.Router()

// This route will fetch the user's data
router.post(
  '/register',
  asyncHandler(async (req, res, next) => {
    const { username, password } = req.body
    const passwordHash = await bcrypt.hash(password, 12)

    const db = await database.get()

    try {
      await db.run(SQL`
        INSERT INTO user
        (Username, PasswordHash)
        VALUES
        (${username}, ${passwordHash})`)
    } catch (e) {
      throw new Error('An user with this username already exists.')
    }

    res.json({
      done: true
    })

    await db.close()
  })
)

// This route will verify the user and give them a JWT
router.post(
  '/signin',
  asyncHandler(async (req, res, next) => {
    const secret = process.env.JWT_SECRET || 'jwtSecret'

    const { username, password } = req.body

    const db = await database.get()

    const user = await db.get(SQL`
      SELECT Id, PasswordHash
      FROM user
      WHERE Username = ${username}`)

    if (user === undefined) {
      throw new Error('Invalid username or password')
    }

    const valid = await bcrypt.compare(password, user.PasswordHash)
    if (!valid) {
      throw new Error('Invalid username or password')
    }

    const accessToken = jsonwebtoken.sign(
      {
        username: username,
        id: user.Id
      },
      secret
    )

    res.json({
      token: {
        accessToken
      }
    })

    await db.close()
  })
)

// This route will fetch the user's data
router.get('/', (req, res, next) => {
  res.json({ user: req.user })
})

export default router
