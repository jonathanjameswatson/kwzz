import express from 'express'
import jsonwebtoken from 'jsonwebtoken'

const router = new express.Router()

// This route will fetch the user's data
router.post('/register', (req, res, next) => {})

// This route will verify the user and give them a JWT
router.post('/signin', (req, res) => {
  const secret = process.env.JWT_SECRET || 'jwtSecret'

  const accessToken = jsonwebtoken.sign(
    {
      username: 'testuser',
      id: '0'
    },
    secret
  )

  res.json({
    token: {
      accessToken
    }
  })
})

// This route will fetch the user's data
router.get('/', (req, res, next) => {
  res.json({ user: req.user })
})

export default router
