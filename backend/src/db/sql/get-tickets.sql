SELECT
  id,
  tier,
  price,
  total_quantity,
  remaining_quantity,
  created_at
FROM tickets
ORDER BY price DESC;
