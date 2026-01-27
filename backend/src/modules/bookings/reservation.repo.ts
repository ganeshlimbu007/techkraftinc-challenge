import {
  BookingErrorCode,
  TicketStatusEnum,
} from "../../data/enums/booking-status";
import { pool } from "../../db";
import { randomUUID } from "crypto";
import { CreateTicketInput, ReservationItem } from "../tickets/ticket.type";
import { ReservationRow } from "./bookings.type";

export async function createReservationTx(params: {
  items: ReservationItem[];
}): Promise<ReservationRow> {
  const client = await pool.connect();
  const token = randomUUID();

  try {
    await client.query("BEGIN");
    const allTicketIds: string[] = [];

    for (const item of params.items) {
      const res = await client.query<{ id: string }>(
        `
        SELECT id
        FROM tickets
        WHERE tier = $1
          AND status = 'AVAILABLE'
        LIMIT $2
        FOR UPDATE
        `,
        [item.tier, item.quantity],
      );

      if ((res.rowCount ?? 0) < item.quantity) {
        throw new Error("INSUFFICIENT_TICKETS");
      }

      allTicketIds.push(...res.rows.map((r) => r.id));
    }

    const ttlMinutes = Number(process.env.RESERVATION_TTL_MINUTES || 2);
    const reservationRes = await client.query<ReservationRow>(
      `
      INSERT INTO reservations (token, status, expires_at)
      VALUES ($1, 'ACTIVE', now() + make_interval(mins => $2))
      RETURNING *
      `,
      [token, ttlMinutes],
    );

    const reservation = reservationRes.rows[0];

    // 3️⃣ Attach tickets to reservation
    await client.query(
      `
      UPDATE tickets
      SET status = $1,
          reservation_id = $2
      WHERE id = ANY($3::uuid[])
      `,
      [TicketStatusEnum.RESERVED, reservation.id, allTicketIds],
    );

    await client.query("COMMIT");
    return reservation;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
