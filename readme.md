# 🎟️ Ticket Booking System

A full-stack ticket booking system with **concurrency-safe
reservations**, **temporary holds**, and a **dummy payment flow**, built
as a take-home assignment.

---

## 📌 Demo

🎥 **Video walkthrough**\
https://drive.google.com/file/d/1T3lntylS9U2wwFmWwKhAVU3b2-bxWO_e/view?usp=sharing

---

## 🧠 Architecture Overview

The system follows a **clean, layered architecture** with clear
separation of concerns.

    Frontend (Next.js)
    │
    ├── Pages & Components
    ├── Service Layer (API abstraction)
    │
    Backend (Node.js + Express)
    │
    ├── Controllers (HTTP layer)
    ├── Services (Business logic)
    ├── Repositories (DB access)
    │
    Database (PostgreSQL via Docker)
    │
    ├── tickets (individual tickets)
    ├── reservations (temporary holds)

### Key Design Decisions

- Individual ticket model (one row per ticket)
- Pessimistic locking (`SELECT … FOR UPDATE`) to prevent double
  booking
- Time-bound reservations (2 minutes)
- Cron-based cleanup for expired reservations
- Docker-managed database schema as a single source of truth

---

## 🗄️ Database Setup

The database schema is initialized via Docker.

```bash
docker compose down -v
docker compose up -d
```

Schema and seed data live in:

    docker/postgres/init/
    ├── 001_schema.sql
    └── 002_seed.sql

---

## ⚙️ Backend Setup (BE)

### Environment Variables

Create `backend/.env`:

```env
DATABASE_URL=postgresql://ticket_user:ticket_pass@localhost:5432/ticket_db
RESERVATION_TTL_MINUTES=2
CRON_CLEANUP_INTERVAL_SECONDS=30
```

### Run Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

    http://localhost:3001

---

## 🎨 Frontend Setup (FE)

### Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

    http://localhost:3000

---

## 🔁 Core Flow

1.  View available tickets
2.  Select tickets (client-side cart)
3.  Create reservation (tickets temporarily locked)
4.  Complete dummy payment
5.  Reservation confirmed or auto-expired
6.  After allocated time (lets say 2 mins) the ticket are available and not reserved to be paid.

---

## ⚙️ Non-Functional Requirements

### Availability (Target: 99.99%)

- Stateless backend services enable horizontal scaling behind a load
  balancer
- Designed to run on Kubernetes with rolling deployments and health
  checks
- PostgreSQL supports primary--replica replication and automated
  failover
- Reservation cleanup ensures recovery from abandoned bookings

### Scalability (\~1,000,000 DAU / \~50,000 concurrent users)

- Stateless APIs allow horizontal autoscaling (HPA in Kubernetes)
- Concurrency handled at the database layer via row-level locks
- Read-heavy endpoints can be cached via CDN or Redis
- Indexed queries reduce contention under load

### Performance (Booking p95 \< 500ms)

- Booking handled in short-lived, single database transactions
- `SELECT … FOR UPDATE` scoped narrowly to required rows
- No synchronous external dependencies in booking path

### Summary

Requirement Design Strategy

---

Availability Stateless services + DB replication
Scalability Horizontal scaling via Kubernetes
Performance Short transactions + indexed queries

---

## 🧪 Notes

- Payment flow is intentionally dummy
- Authentication is out of scope
- Focus is on correctness, concurrency, and system design

---

## ✅ Final Remarks

This project emphasizes **data consistency, concurrency safety, and
clean architecture**, reflecting real-world backend and system design
considerations.
