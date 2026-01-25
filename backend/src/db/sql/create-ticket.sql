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
