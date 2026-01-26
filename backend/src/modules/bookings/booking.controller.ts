import { Request, Response } from "express";
import { reserveTickets, confirmPayment } from "./reservation.service";

export async function createReservation(req: Request, res: Response) {
  const { ticketId, quantity } = req.body;
  const reservation = await reserveTickets({ ticketId, quantity });

  res.status(201).json({
    reservationToken: reservation.token,
    expiresAt: reservation.expires_at,
  });
}

export async function confirmBooking(req: Request, res: Response) {
  const { reservationToken, paymentIntentId } = req.body;

  const booking = await confirmPayment({
    reservationToken,
    paymentIntentId,
  });

  res.status(200).json({
    bookingId: booking.id,
    status: booking.status,
  });
}
