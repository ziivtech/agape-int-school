import { neon } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export type Database = NeonHttpDatabase<typeof schema>;

let instance: Database | null = null;

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/**
 * Returns the Neon (HTTP) Drizzle client, or null when DATABASE_URL is unset.
 * The public site falls back to built-in defaults when there is no database.
 */
export function getDb(): Database | null {
  if (!process.env.DATABASE_URL) return null;
  if (!instance) {
    instance = drizzle(neon(process.env.DATABASE_URL), { schema });
  }
  return instance;
}

/** For admin/API code paths where a database is mandatory. */
export function requireDb(): Database {
  const db = getDb();
  if (!db) {
    throw new Error("DATABASE_URL is not set. Add your Neon connection string to the environment.");
  }
  return db;
}

export { schema };
