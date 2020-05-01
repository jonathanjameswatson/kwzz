UPDATE Quiz
SET isPublished = 1,
  publishedTimestamp = NOW()
WHERE owner = ${userId}
  AND Id = ${id}
  AND IsPublished = 0
