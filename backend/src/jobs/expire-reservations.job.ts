import cron from "node-cron";
import fs from "fs";
import path from "path";
import { pool } from "../db";

// Load SQL once
const cleanupSql = fs.readFileSync(
  path.join(__dirname, "../db/cleanup/expire_reservations.sql"),
  "utf8",
);

// Run every 30 seconds
cron.schedule("*/30 * * * * *", async () => {
  try {
    console.log("hello running cron job");
    await pool.query(cleanupSql);
    console.log("[CRON] Expired reservations released");
  } catch (err) {
    console.error("[CRON] Failed to release reservations", err);
  }
});
