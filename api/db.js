import sqlite from 'sqlite'

export default {
  // Initialises the database
  async initialise() {
    // Open database
    const db = await sqlite.open('./api/database.sqlite')

    // Create database
    await db.exec(`
    CREATE TABLE IF NOT EXISTS quiz (
      Id INTEGER NOT NULL PRIMARY KEY,
      Title TEXT NOT NULL,
      Questions TEXT,
      Owner INTEGER NOT NULL DEFAULT 0,
      IsPublished INTEGER NOT NULL DEFAULT 0 CHECK (IsPublished IN (0,1)),
      MadeTimestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PublishedTimestamp DATETIME,
      FOREIGN KEY(Owner) REFERENCES user(Id)
    );

    CREATE TABLE IF NOT EXISTS result (
      Id INTEGER NOT NULL PRIMARY KEY,
      Quiz INTEGER NOT NULL,
      User INTEGER NOT NULL DEFAULT 0,
      Answers TEXT,
      Score INTEGER,
      TimeTaken INTEGER,
      Improvement INTEGER,
      MadeTimestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(Quiz) REFERENCES quiz(Id),
      FOREIGN KEY(User) REFERENCES user(Id)
    );

    CREATE TABLE IF NOT EXISTS topicResult (
      Id INTEGER NOT NULL PRIMARY KEY,
      Result INTEGER NOT NULL,
      Topic TEXT NOT NULL,
      Score INTEGER,
      FOREIGN KEY(Result) REFERENCES result(Id)
    );

    CREATE TABLE IF NOT EXISTS user (
      Id INTEGER NOT NULL PRIMARY KEY,
      Username TEXT UNIQUE NOT NULL,
      PasswordHash TEXT NOT NULL
    );
    `)

    await db.close()
  },

  // Returns database as a promise
  get() {
    return sqlite.open('./api/database.sqlite')
  }
}
