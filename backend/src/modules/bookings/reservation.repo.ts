import { pool } from "../../db";
import { randomUUID } from "crypto";

import { ReservationRow } from "./bookings.type";

import { BadRequestError } from "../../utils/errors/bad-request-error";

export async function createReservationTx(params: {
  ticketIds: string[];
}): Promise<ReservationRow> {
  const client = await pool.connect();
  const token = randomUUID();

  try {
    await client.query("BEGIN");

    // 1️⃣ Lock selected tickets
    const res = await client.query<{ id: string }>(
      `
      SELECT id
      FROM tickets
      WHERE id = ANY($1::uuid[])
        AND status = 'AVAILABLE'
      FOR UPDATE
      `,
      [params.ticketIds],
    );

    if (res.rowCount !== params.ticketIds.length) {
      throw new BadRequestError("INVALID_OR_UNAVAILABLE_TICKETS ");
    }

    const ttlMinutes = Number(process.env.RESERVATION_TTL_MINUTES || 2);

    // 2️⃣ Create reservation
    const reservationRes = await client.query<ReservationRow>(
      `
      INSERT INTO reservations (token, status, expires_at)
      VALUES ($1, 'ACTIVE', now() + make_interval(mins => $2))
      RETURNING *
      `,
      [token, ttlMinutes],
    );

    const reservation = reservationRes.rows[0];

    // 3️⃣ Attach tickets
    await client.query(
      `
      UPDATE tickets
      SET status = 'RESERVED',
          reservation_id = $1
      WHERE id = ANY($2::uuid[])
      `,
      [reservation.id, params.ticketIds],
    );

    await client.query("COMMIT");
    return reservation;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
