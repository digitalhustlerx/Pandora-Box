import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const databaseUrl = process.env.DATABASE_URL;

// Initialize only when DATABASE_URL is provided.
// Public pages can render without a DB in early dev.
export const db = databaseUrl ? drizzle(neon(databaseUrl)) : null;
