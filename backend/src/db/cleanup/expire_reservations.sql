import cron from "node-cron";
import { pool } from "../db";

const bufferSeconds = Number(
  process.env.RESERVATION_CLEANUP_BUFFER_SECONDS || 5
);

const intervalSeconds = Number(
  process.env.CRON_CLEANUP_INTERVAL_SECONDS || 30
);

const cleanupSql = `
BEGIN;

-- Re-release tickets
UPDATE tickets
SET status = 'AVAILABLE',
    reservation_id = NULL
WHERE reservation_id IN (
  SELECT id
  FROM reservations
  WHERE status = 'ACTIVE'
    AND expires_at < now() - make_interval(secs => ${bufferSeconds})
);

-- Mark reservations expired
UPDATE reservations
SET status = 'EXPIRED'
WHERE status = 'ACTIVE'
  AND expires_at < now() - make_interval(secs => ${bufferSeconds});

COMMIT;
`;

cron.schedule(`*/${intervalSeconds} * * * * *`, async () => {
  try {
    await pool.query(cleanupSql);
    console.log("[CRON] expired reservations cleaned");
  } catch (err) {
    console.error("[CRON] cleanup failed", err);
  }
});
