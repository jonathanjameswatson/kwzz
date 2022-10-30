SELECT id, score, timeTaken
FROM "Result"
WHERE quiz = ${id}
  AND (SELECT owner FROM "Quiz" WHERE id=${id}) = ${userId}
ORDER BY madeTimestamp DESC
