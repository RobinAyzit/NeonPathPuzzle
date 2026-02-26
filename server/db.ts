
import * as schema from "@shared/schema";

let db: any;

if (process.env.NODE_ENV === "development" && !process.env.DATABASE_URL) {
  // For local development, use SQLite
  const { drizzle: drizzleSqlite } = await import("drizzle-orm/better-sqlite3");
  const Database = (await import("better-sqlite3")).default;
  
  const sqlite = new Database("dev.db");
  db = drizzleSqlite(sqlite, { schema });
  
  // Create tables if they don't exist
  const tables = `
    CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      level_id INTEGER NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      hints_used BOOLEAN DEFAULT FALSE,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  sqlite.exec(tables);
} else {
  // For production, use PostgreSQL
  const { drizzle } = await import("drizzle-orm/node-postgres");
  const pg = await import("pg");
  const { Pool } = pg.default;

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle(pool, { schema });
}

export { db };
