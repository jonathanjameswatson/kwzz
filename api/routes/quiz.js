import express from 'express'

const router = new express.Router()

// This route will fetch a set of quizzes
router.get('/', (req, res, next) => {})

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
