import express from 'express'
import cookieParser from 'cookie-parser'
import jwt from 'express-jwt'

import user from './routes/user.js'

// Create the api
const api = express()

// Add cookieParser for JWT
api.use(cookieParser())

// Require JWT authentication for all routes except some
api.use(
  '/',
  jwt({
    secret: 'jwtSecret'
  }).unless({
    path: ['/api/user/register', '/api/user/signin']
  })
)

api.use('/user', user)

// Export the api
export default api
