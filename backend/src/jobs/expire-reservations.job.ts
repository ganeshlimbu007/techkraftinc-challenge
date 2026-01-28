import cron from "node-cron";
import { pool } from "../db";

const cronSeconds = Number(process.env.CRON_CLEANUP_INTERVAL_SECONDS || 30);

const bufferSeconds = Number(
  process.env.RESERVATION_CLEANUP_BUFFER_SECONDS || 5,
);

const cronExpression = `*/${cronSeconds} * * * * *`;

const cleanupSql = `
BEGIN;

UPDATE tickets
SET status = 'AVAILABLE',
    reservation_id = NULL
WHERE reservation_id IN (
  SELECT id
  FROM reservations
  WHERE status = 'ACTIVE'
    AND expires_at < now() - make_interval(secs => ${bufferSeconds})
);

UPDATE reservations
SET status = 'EXPIRED'
WHERE status = 'ACTIVE'
  AND expires_at < now() - make_interval(secs => ${bufferSeconds});

COMMIT;
`;

cron.schedule(cronExpression, async () => {
  try {
    await pool.query(cleanupSql);
  } catch (err) {}
});
