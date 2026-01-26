import { BookingErrorCode } from "../../data/enums/booking-status";
import { pool } from "../../db";
import { randomUUID } from "crypto";

export async function createReservationTx({
  ticketId,
  quantity,
}: {
  ticketId: string;
  quantity: number;
}) {
  const client = await pool.connect();
  const token = randomUUID();

  try {
    await client.query("BEGIN");

    const ticket = await client.query(
      `SELECT remaining_quantity FROM tickets WHERE id=$1 FOR UPDATE`,
      [ticketId],
    );

    if (ticket.rowCount === 0)
      throw new Error(BookingErrorCode.TICKET_NOT_FOUND);

    if (ticket.rows[0].remaining_quantity < quantity)
      throw new Error(BookingErrorCode.INSUFFICIENT_INVENTORY);

    await client.query(
      `UPDATE tickets SET remaining_quantity = remaining_quantity - $1 WHERE id=$2`,
      [quantity, ticketId],
    );

    const reservation = await client.query(
      `
      INSERT INTO reservations
      (ticket_id, quantity, token, status, expires_at)
      VALUES ($1, $2, $3, 'ACTIVE', now() + interval '2 minutes')
      RETURNING *
      `,
      [ticketId, quantity, token],
    );

    await client.query("COMMIT");
    return reservation.rows[0];
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
