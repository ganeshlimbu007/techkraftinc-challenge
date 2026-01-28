-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop old tables (safe on reset)
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;

-- =========================
-- RESERVATIONS
-- =========================
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  token UUID NOT NULL UNIQUE,

  status TEXT NOT NULL
    CHECK (status IN ('ACTIVE', 'CONFIRMED', 'EXPIRED')),

  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- =========================
-- TICKETS (INDIVIDUAL)
-- =========================
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  tier TEXT NOT NULL
    CHECK (tier IN ('VIP', 'FRONT_ROW', 'GA')),

  price INT NOT NULL CHECK (price > 0),

  status TEXT NOT NULL
    CHECK (status IN ('AVAILABLE', 'RESERVED', 'SOLD')),

  reservation_id UUID NULL,

  created_at TIMESTAMP DEFAULT now(),

  CONSTRAINT fk_ticket_reservation
    FOREIGN KEY (reservation_id)
    REFERENCES reservations(id)
    ON DELETE SET NULL
);

-- =========================
-- INDEXES
-- =========================
CREATE INDEX idx_tickets_status
  ON tickets(status);

CREATE INDEX idx_tickets_tier_status
  ON tickets(tier, status);

CREATE INDEX idx_reservations_token
  ON reservations(token);

CREATE INDEX idx_reservations_expiry
  ON reservations(status, expires_at);
