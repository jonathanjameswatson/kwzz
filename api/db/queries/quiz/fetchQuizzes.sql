SELECT id, title, owner, isPublished, COUNT(*) OVER() AS total
FROM "Quiz"
WHERE ((owner = ${userId}) OR ((NOT ${isUser}) AND (isPublished = TRUE)))
  AND title ~ ${searchString}
ORDER BY COALESCE(publishedTimestamp, madeTimestamp) DESC
LIMIT ${limit} OFFSET ${offset}
