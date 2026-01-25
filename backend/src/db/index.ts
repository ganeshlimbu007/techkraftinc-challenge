import { Pool } from "pg";
import { DatabaseConnectionError } from "../utils/errors/database-connection-error";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Verify DB connection on startup
 */
export const connectToDatabase = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Connected to PostgreSQL");
  } catch (err) {
    console.error("❌ Database connection failed");
    throw new DatabaseConnectionError();
  }
};
