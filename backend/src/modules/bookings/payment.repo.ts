import { BookingErrorCode } from "../../data/enums/booking-status";
import { pool } from "../../db";

import { ReservationRow } from "./bookings.type";

export async function confirmReservationTx(
  token: string,
): Promise<ReservationRow> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 🔒 Lock + validate reservation in ONE step
    const res = await client.query<ReservationRow>(
      `
      SELECT *
      FROM reservations
      WHERE token = $1
        AND status = 'ACTIVE'
        AND expires_at > now()
      FOR UPDATE
      `,
      [token],
    );

    // ❌ Invalid / expired / already confirmed
    if (res.rowCount === 0) {
      throw new Error(BookingErrorCode.RESERVATION_EXPIRED);
    }

    const reservation = res.rows[0];

    // ✅ Confirm reservation
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
