CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  tier TEXT NOT NULL
    CHECK (tier IN ('VIP', 'FRONT_ROW', 'GA')),

  price INT NOT NULL
    CHECK (price > 0),

  total_quantity INT NOT NULL
    CHECK (total_quantity > 0),

  remaining_quantity INT NOT NULL
    CHECK (remaining_quantity >= 0),

  created_at TIMESTAMP DEFAULT now(),

  CONSTRAINT remaining_not_exceed_total
    CHECK (remaining_quantity <= total_quantity),

  CONSTRAINT unique_ticket_tier UNIQUE (tier)
);
