SELECT title, questions
FROM Quiz
WHERE id = ${id}
  AND (owner = ${userId} OR isPublished = 1)
