SELECT answers, quiz, (SELECT questions FROM "Quiz" WHERE "Quiz".id="Result".quiz) AS questions
FROM "Result"
WHERE id = ${id}
  AND ("user" = ${userId}
  OR (SELECT owner FROM "Quiz" WHERE "Quiz".id="Result".quiz) = ${userId})
ORDER BY madeTimestamp DESC
