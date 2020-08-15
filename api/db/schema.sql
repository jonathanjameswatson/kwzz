CREATE TABLE "User"(
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    passwordHash CHAR(60) NOT NULL
);

CREATE TABLE "Quiz"(
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    questions TEXT NOT NULL,
    owner INTEGER NOT NULL REFERENCES "User"(id),
    isPublished BOOLEAN DEFAULT FALSE NOT NULL,
    views INTEGER DEFAULT 0 NOT NULL,
    madeTimestamp TIMESTAMPTZ DEFAULT NOW(),
    publishedTimestamp TIMESTAMPTZ
);

CREATE TABLE "Result"(
    id SERIAL PRIMARY KEY,
    quiz INTEGER NOT NULL REFERENCES "Quiz"(id),
    "user" INTEGER NOT NULL REFERENCES "User"(id),
    answers TEXT NOT NULL,
    score INTEGER NOT NULL,
    timeTaken INTEGER NOT NULL,
    improvement INTEGER,
    madeTimestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE "TopicResult"(
    id SERIAL PRIMARY KEY,
    result INTEGER NOT NULL REFERENCES "Result"(id),
    topic VARCHAR(30) NOT NULL,
    score INTEGER NOT NULL
);