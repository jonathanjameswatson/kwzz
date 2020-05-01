UPDATE Quiz
SET title = ${title},
  questions = ${questionsJson}
WHERE owner = ${userId}
  AND id = ${id}
  AND isPublished = 0
