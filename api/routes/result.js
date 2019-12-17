import express from 'express'

const router = new express.Router()

// This route will save a user's attempt at a quiz
router.post('/', (req, res, next) => {})

// This route will fetch a single quiz from its ID
router.get('/quiz/:id', (req, res, next) => {})

// This route will fetch an attempt from its ID
router.get('/attempt/:id', (req, res, next) => {})

// This route will publish the list of all results
// from all players on a quiz from its ID
router.get('/players/:id', (req, res, next) => {})

export default router
