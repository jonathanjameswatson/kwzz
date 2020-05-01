UPDATE Quiz
SET isPublished = 1,
  publishedTimestamp = NOW()
WHERE owner = ${userId}
  AND id = ${id}
  AND isPublished = 0
