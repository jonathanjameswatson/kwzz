INSERT INTO "Result"
  (quiz, "user", answers, score, timeTaken, improvement)
VALUES
  (${id},
  ${userId},
  ${newAnswers},
  ${totalScore},
  ${timeTaken},
  ${improvement})
RETURNING id AS resultId
