# Ticket Booking Backend

A backend service for ticket booking with **safe concurrency**, **reservations with expiry**, and **automated cleanup**.
Built to prevent overselling and handle race conditions correctly.

---

## Overview

This service allows users to:

1. View available tickets
2. Reserve selected tickets for a limited time
3. Confirm payment to finalize booking
4. Automatically release tickets if a reservation expires

The backend is implemented using **Node.js, TypeScript, Express, and PostgreSQL**, relying on database-level locking for correctness under concurrent access.

---

## Architecture

```
Controller  →  Service  →  Repository  →  PostgreSQL
                        ↘
                         Cron Job (cleanup)
```

### Layer Responsibilities

| Layer      | Responsibility                       |
| ---------- | ------------------------------------ |
| Controller | HTTP request/response handling       |
| Service    | Business rules and orchestration     |
| Repository | SQL, transactions, row-level locking |
| Cron Job   | Release expired reservations         |
| Database   | Source of truth                      |

---

## Data Model

### Tickets

Each ticket is stored as an **individual row**.

| Column         | Description                       |
| -------------- | --------------------------------- |
| id             | UUID primary key                  |
| tier           | VIP / FRONT_ROW / GA              |
| price          | Ticket price                      |
| status         | AVAILABLE / RESERVED / SOLD       |
| reservation_id | Nullable reference to reservation |
| created_at     | Timestamp                         |

### Reservations

| Column     | Description                  |
| ---------- | ---------------------------- |
| id         | UUID primary key             |
| token      | Public reservation token     |
| status     | ACTIVE / CONFIRMED / EXPIRED |
| expires_at | Reservation expiry time      |
| created_at | Timestamp                    |

---

## Booking Flow

1. Client fetches available tickets
2. Client selects ticket IDs
3. Backend:
   - Locks selected tickets using `SELECT … FOR UPDATE`
   - Creates a reservation with an expiry time
   - Marks tickets as `RESERVED`

4. Client confirms payment
5. Backend:
   - Validates reservation is still active
   - Marks tickets as `SOLD`
   - Marks reservation as `CONFIRMED`

If payment is not completed before expiry, tickets are released automatically.

---

## API Endpoints

### Get all tickets

```
GET /tickets
```

Response:

```json
{
  "tickets": [
    {
      "id": "uuid",
      "tier": "VIP",
      "price": 100,
      "status": "AVAILABLE"
    }
  ]
}
```

---

### Create reservation (ID-based)

```
POST /bookings/reservations
```

Request:

```json
{
  "ticketIds": ["uuid-1", "uuid-2"]
}
```

Response:

```json
{
  "reservationToken": "uuid",
  "expiresAt": "2026-01-26T07:52:15.233Z"
}
```

---

### Confirm payment

```
POST /bookings/payments/confirm
```

Request:

```json
{
  "reservationToken": "uuid",
  "paymentIntentId": "dummy_123"
}
```

Response:

```json
{
  "bookingId": "uuid",
  "status": "CONFIRMED"
}
```

---

## Concurrency & Safety

The system prevents overselling through:

- Row-level locking (`SELECT … FOR UPDATE`)
- Single database transactions per operation
- Database time (`now()`) for expiry checks
- Atomic state transitions

Only one request can reserve or confirm a ticket at a time.

---

## Cleanup & Expiry Handling

Expired reservations are handled asynchronously by a cron job:

- Runs at a fixed interval
- Marks expired reservations as `EXPIRED`
- Releases associated tickets back to `AVAILABLE`
- Never touches `SOLD` tickets

This keeps API requests fast and deterministic.

---

## Error Handling

- All business rule violations return **400 Bad Request**
- Examples:
  - Invalid or unavailable tickets
  - Empty ticket selection
  - Expired reservation
  - Double payment attempt

- Unexpected failures return **500 Internal Server Error**

Errors are handled through a shared `CustomError` base class.

---

## Database Setup (Automated)

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://ticket_user:ticket_pass@localhost:5432/ticket_db
RESERVATION_TTL_MINUTES=2
CRON_CLEANUP_INTERVAL_SECONDS=30
RESERVATION_CLEANUP_BUFFER_SECONDS=5
```

---

### One-Command Setup

```bash
npm run db:setup
```

This command:

1. Drops the existing schema
2. Runs all migrations
3. Seeds initial ticket data

---

## Edge Cases Covered

- Empty ticket selection
- Invalid ticket IDs
- Already reserved or sold tickets
- Reservation expiry before payment
- Double payment attempts
- Concurrent reservation requests
- Cleanup vs payment race conditions

All tested manually and validated at the database level.

---

## Design Notes

- Tickets are modeled as **individual entities**, not quantities
- No derived state (counts) is stored
- PostgreSQL is the source of truth for concurrency
- Cleanup logic is fully decoupled from request flow

---

## Running the Backend

```bash
npm install
npm run db:setup
npm run dev
```

The backend starts with cron cleanup enabled.

---

## Summary

This backend demonstrates:

- Safe concurrency handling
- Robust reservation and booking logic
- Clean layered architecture
- Automated database setup
- Thorough edge-case handling

Designed to reflect real-world booking systems rather than a simplified demo.
