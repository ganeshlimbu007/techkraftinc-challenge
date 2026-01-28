BEGIN;

-- VIP
INSERT INTO tickets (tier, price, status)
SELECT 'VIP', 100, 'AVAILABLE'
FROM generate_series(1, 10);

-- FRONT_ROW
INSERT INTO tickets (tier, price, status)
SELECT 'FRONT_ROW', 50, 'AVAILABLE'
FROM generate_series(1, 15);

-- GA
INSERT INTO tickets (tier, price, status)
SELECT 'GA', 10, 'AVAILABLE'
FROM generate_series(1, 20);

COMMIT;
