SELECT score
FROM "Result"
WHERE quiz = ${id}
AND user = ${userId}
ORDER BY madeTimestamp DESC
