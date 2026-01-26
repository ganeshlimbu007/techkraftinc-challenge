BEGIN;

 
UPDATE tickets t
SET remaining_quantity = remaining_quantity + r.quantity
FROM reservations r
WHERE r.ticket_id = t.id
  AND r.status = 'ACTIVE'
  AND r.expires_at < now() - interval '5 seconds';

-- 2️⃣ Mark reservations as expired
UPDATE reservations
SET status = 'EXPIRED'
WHERE status = 'ACTIVE'
  AND expires_at < now() - interval '5 seconds';

COMMIT;
