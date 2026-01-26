import {
  BookingErrorCode,
  BookingStatusEnum,
} from "../../data/enums/booking-status";
import { pool } from "../../db";
import { BookingRow } from "./bookings.type";
export async function createBookingTx(params: {
  ticketId: string;
  quantity: number;
  onPaymentSuccess: () => Promise<void> | void;
}): Promise<BookingRow> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Lock ticket row
    const ticketRes = await client.query(
      `
      SELECT remaining_quantity
      FROM tickets
      WHERE id = $1
      FOR UPDATE
      `,
      [params.ticketId],
    );

    if (ticketRes.rowCount === 0) {
      throw new Error(BookingErrorCode.TICKET_NOT_FOUND);
    }

    const remaining = ticketRes.rows[0].remaining_quantity;

    // 2️⃣ Check inventory
    if (remaining < params.quantity) {
      throw new Error(BookingErrorCode.INSUFFICIENT_INVENTORY);
    }

    // 3️⃣ Decrement inventory
    await client.query(
      `
      UPDATE tickets
      SET remaining_quantity = remaining_quantity - $1
      WHERE id = $2
      `,
      [params.quantity, params.ticketId],
    );

    // 4️⃣ Create booking (PENDING)
    const bookingRes = await client.query<BookingRow>(
      `
      INSERT INTO bookings (ticket_id, quantity, status)
      VALUES ($1, $2, 'PENDING')
      RETURNING *
      `,
      [params.ticketId, params.quantity],
    );

    const booking = bookingRes.rows[0];

    // 5️⃣ Let service decide payment outcome
    await params.onPaymentSuccess();

    // 6️⃣ Confirm booking
    await client.query(
      `
      UPDATE bookings
      SET status = 'CONFIRMED'
      WHERE id = $1
      `,
      [booking.id],
    );

    await client.query("COMMIT");

    return { ...booking, status: BookingStatusEnum.CONFIRMED };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
