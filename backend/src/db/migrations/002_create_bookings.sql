CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  token UUID NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'CONFIRMED', 'EXPIRED')),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  CONSTRAINT fk_ticket_reservation
    FOREIGN KEY (ticket_id)
    REFERENCES tickets(id)
    ON DELETE RESTRICT
);
