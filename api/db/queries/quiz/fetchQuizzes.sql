SELECT id, title, owner, isPublished, COUNT(*) OVER() AS total
FROM "Quiz"
WHERE owner = (${userId} OR ((NOT ${isUser}) AND (isPublished = 1)))
  AND title LIKE ${searchString}
ORDER BY MAX(madeTimestamp, COALESCE(publishedTimestamp, 0)) DESC
LIMIT ${limit} OFFSET ${offset}
