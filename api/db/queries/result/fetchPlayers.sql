SELECT id, score, timeTaken, (SELECT username FROM "User" WHERE "User".id="Result"."user") AS username
FROM "Result"
WHERE quiz = ${id}
  AND (SELECT owner FROM "Quiz" WHERE id=${id}) = ${userId}
ORDER BY madeTimestamp DESC
