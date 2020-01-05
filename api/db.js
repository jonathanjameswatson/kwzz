import sqlite from 'sqlite'

export default {
  // Initialises the database
  async initialise() {
    // Open database
    const db = await sqlite.open('./api/database.sqlite')

    // Create database
    await db.exec(`
    DROP TABLE IF EXISTS quiz;

    CREATE TABLE quiz (
      Id INTEGER NOT NULL PRIMARY KEY,
      Title TEXT NOT NULL,
      Questions TEXT,
      Owner INTEGER NOT NULL DEFAULT 0,
      IsPublished INTEGER NOT NULL DEFAULT 0 CHECK (IsPublished IN (0,1)),
      MadeTimestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PublishedTimestamp DATETIME
    );

    INSERT INTO quiz(Title, Owner, IsPublished) VALUES ('Test quiz 1', 0, 1);
    INSERT INTO quiz(Title, Owner, IsPublished) VALUES ('Test quiz 2', 1, 1);
    INSERT INTO quiz(Title, Owner, IsPublished) VALUES ('Test quiz 3', 0, 0);
    `)

    await db.close()
  },

  // Returns database as a promise
  get() {
    return sqlite.open('./api/database.sqlite')
  }
}
