UPDATE "Quiz"
SET isPublished = TRUE,
  publishedTimestamp = NOW()
WHERE owner = ${userId}
  AND id = ${id}
  AND isPublished = FALSE
