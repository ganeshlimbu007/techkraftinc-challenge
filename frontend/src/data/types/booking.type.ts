export type BookingConfirm = {
  reservationToken: string;
  paymentIntentId: string;
};
export interface CreateReservationRequest {
  ticketIds: string[];
}

export interface CreateReservationResponse {
  reservationToken: string;
  expiresAt: string;
}
