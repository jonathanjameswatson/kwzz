import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import jwt from 'express-jwt'

import quiz from './routes/quiz.js'
import result from './routes/result.js'
import user from './routes/user.js'

// Create the api
const api = express()

// Add cookieParser for JWT
api.use(cookieParser())

// Add bodyparser to see the contents of request bodies
api.use(bodyParser.json())

// Require JWT authentication for all routes except some
api.use(
  '/',
  jwt({
    secret: process.env.JWT_SECRET || 'jwtSecret',
    algorithms: ['HS256']
  }).unless({
    path: ['/api/user/register', '/api/user/signin']
  })
)

api.use('/quiz', quiz)
api.use('/result', result)
api.use('/user', user)

// Export the api
export default api
