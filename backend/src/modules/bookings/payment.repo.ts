import {
  BookingErrorCode,
  TicketStatusEnum,
} from "../../data/enums/booking-status";
import { pool } from "../../db";

import { ReservationRow } from "./bookings.type";

export async function confirmPaymentTx(params: {
  reservationToken: string;
  paymentIntentId: string;
}): Promise<ReservationRow> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Lock reservation & validate expiry (DB time)
    const res = await client.query<ReservationRow>(
      `
      SELECT *
      FROM reservations
      WHERE token = $1
        AND status = 'ACTIVE'
        AND expires_at > now()
      FOR UPDATE
      `,
      [params.reservationToken],
    );

    if (res.rowCount === 0) {
      throw new Error(BookingErrorCode.RESERVATION_EXPIRED);
    }

    const reservation = res.rows[0];

    // 2️⃣ Mark tickets as SOLD
    await client.query(
      `
      UPDATE tickets
      SET status = $1
      WHERE reservation_id = $2
      `,
      [TicketStatusEnum.SOLD, reservation.id],
    );

    // 3️⃣ Mark reservation as CONFIRMED
    await client.query(
      `
      UPDATE reservations
      SET status = 'CONFIRMED'
      WHERE id = $1
      `,
      [reservation.id],
    );

    await client.query("COMMIT");

    return {
      ...reservation,
      status: "CONFIRMED",
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
