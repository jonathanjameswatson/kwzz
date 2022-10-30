SELECT title, questions
FROM "Quiz"
WHERE id = ${id}
  AND (owner = ${userId} OR isPublished = TRUE)
