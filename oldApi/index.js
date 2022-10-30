import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import { OAuth2Client } from 'google-auth-library'
import asyncHandler from 'express-async-handler'

import quiz from './routes/quiz.js'
import result from './routes/result.js'

// Create the api
const api = express()

// Add cookieParser for JWT
api.use(cookieParser())

// Add bodyparser to see the contents of request bodies
api.use(bodyParser.json())

const clientId = process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client(clientId)

// Require JWT authentication for all routes except some
api.use(
  '/',
  asyncHandler(async (req, res, next) => {
    const parts = req.headers.authorization.split(' ')
    const token = parts[1]

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId
    })
    const payload = ticket.getPayload()
    req.user = {
      id: payload.sub
    }
    next()
  })
)

api.use('/quiz', quiz)
api.use('/result', result)

// Export the api
export default api
