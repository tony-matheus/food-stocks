import { open } from 'sqlite'
import sqlite3 from 'sqlite3'

export const initDB = async () => {
  const db = await open({ filename: 'products.db', driver: sqlite3.Database })

  db.run('PRAGMA foreign_keys = ON')

  db.getDatabaseInstance().serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        userId TEXT,
        name TEXT,
        price TEXT,
        timestamp TEXT,
        createdAt DATE DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `)

    db.run(`
      CREATE INDEX IF NOT EXISTS idx_products_userId ON products (userId)
    `)
  })

  return db
}
