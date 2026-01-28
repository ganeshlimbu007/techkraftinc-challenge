import { BookingConfirm } from "@/src/data/types/booking.type";
import { api } from "@/src/lib/api";

export async function confirmBooking(booking: BookingConfirm) {
  const res = await api.post("/bookings/payments/confirm", { ...booking });

  return res.data;
}
