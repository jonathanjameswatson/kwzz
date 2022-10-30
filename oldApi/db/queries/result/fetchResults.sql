SELECT id, score, timeTaken, improvement
FROM "Result"
WHERE quiz = ${id}
  AND ("user" = ${userId}
  OR (SELECT owner FROM "Quiz" WHERE id=${id}) = ${userId})
ORDER BY madeTimestamp DESC
