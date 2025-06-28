import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';

// Create the SQLite database instance
const dbPath = path.join(process.cwd(), 'sdwa_georgia.db');
const sqlite = new Database(dbPath, {
  readonly: true, // Since we're only reading data
  fileMustExist: true,
});

// Create the Drizzle ORM instance
export const db = drizzle(sqlite, { schema });

// Export schema for easy access
export * from './schema';

// Helper function to close the database connection
export const closeDb = () => {
  sqlite.close();
};
