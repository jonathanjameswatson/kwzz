SELECT title, questions
FROM "Quiz"
WHERE owner = ${userId}
  AND id = ${quizId}
  AND isPublished = 0
