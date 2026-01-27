import express, { Request, Response } from "express";
import { BookingService } from "./booking.service";

const router = express.Router();

router.post("/bookings/reservations", async (req: Request, res: Response) => {
  try {
    const { ticketIds } = req.body;

    const reservation = await BookingService.createReservation(ticketIds);

    res.status(201).json({
      reservationToken: reservation.token,
      expiresAt: reservation.expires_at,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export { router as bookingRouter };
