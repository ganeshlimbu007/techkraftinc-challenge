
-- Required for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  ticket_id UUID NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),

  status TEXT NOT NULL
    CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED')),

  created_at TIMESTAMP DEFAULT now(),

  CONSTRAINT fk_ticket
    FOREIGN KEY (ticket_id)
    REFERENCES tickets(id)
    ON DELETE RESTRICT
);
