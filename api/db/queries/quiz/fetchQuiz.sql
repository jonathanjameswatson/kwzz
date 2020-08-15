SELECT title, questions
FROM "Quiz"
WHERE owner = ${userId}
  AND id = ${id}
  AND isPublished = FALSE
