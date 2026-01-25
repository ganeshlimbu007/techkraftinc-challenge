-- Create ticket
-- name: CreateTicket
INSERT INTO tickets (
  tier,
  price,
  total_quantity,
  remaining_quantity
)
VALUES ($1, $2, $3, $3)
RETURNING
  id,
  tier,
  price,
  total_quantity,
  remaining_quantity,
  created_at;

-- Get all tickets
-- name: GetAllTickets
SELECT
  id,
  tier,
  price,
  total_quantity,
  remaining_quantity,
  created_at
FROM tickets
ORDER BY price DESC;
