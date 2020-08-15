INSERT INTO "Quiz"
(title, questions, owner)
VALUES
(${title}, ${questions}, ${userId})
RETURNING id AS lastId
