import cron from "node-cron";
import fs from "fs";
import path from "path";
import { pool } from "../db";
const cronSeconds = Number(process.env.CRON_CLEANUP_INTERVAL_SECONDS || 30);
const cronExpression = `*/${cronSeconds} * * * * *`;
// Load SQL once
const cleanupSql = fs.readFileSync(
  path.join(__dirname, "../db/cleanup/expire_reservations.sql"),
  "utf8",
);

// Run every 30 seconds
cron.schedule(cronExpression, async () => {
  try {
    console.log("hello running cron job");
    await pool.query(cleanupSql);
    console.log("[CRON] Expired reservations released");
  } catch (err) {
    console.error("[CRON] Failed to release reservations", err);
  }
});
