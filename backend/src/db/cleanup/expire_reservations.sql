const bufferSeconds = Number(
  process.env.RESERVATION_CLEANUP_BUFFER_SECONDS || 5
);

const cleanupSql = `
BEGIN;

UPDATE tickets t
SET remaining_quantity = remaining_quantity + r.quantity
FROM reservations r
WHERE r.ticket_id = t.id
  AND r.status = 'ACTIVE'
  AND r.expires_at < now() - make_interval(secs => ${bufferSeconds});

UPDATE reservations
SET status = 'EXPIRED'
WHERE status = 'ACTIVE'
  AND expires_at < now() - make_interval(secs => ${bufferSeconds});

COMMIT;
`;
