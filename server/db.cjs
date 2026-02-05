const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const initDb = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Articles table
      db.run(`
        CREATE TABLE IF NOT EXISTS articles (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          image_url TEXT,
          source_url TEXT UNIQUE NOT NULL,
          author TEXT,
          published_at DATETIME NOT NULL,
          tags TEXT, -- Store as JSON string
          priority INTEGER DEFAULT 0,
          source_name TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Metrics table
      db.run(`
        CREATE TABLE IF NOT EXISTS article_metrics (
          article_id TEXT PRIMARY KEY,
          views INTEGER DEFAULT 0,
          helpful INTEGER DEFAULT 0,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // User likes table (anonymous fingerprint)
      db.run(`
        CREATE TABLE IF NOT EXISTS user_likes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          article_id TEXT NOT NULL,
          user_fingerprint TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(article_id, user_fingerprint)
        )
      `);

      resolve();
    });
  });
};

module.exports = {
  db,
  initDb
};
