SELECT
  tier,
  price,
  status,
  COUNT(*)::int AS count
FROM tickets
GROUP BY tier, price, status
ORDER BY price DESC;

