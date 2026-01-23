export const BOOKING_STATUS = ["CONFIRMED", "FAILED"] as const;

export type BookingStatus = (typeof BOOKING_STATUS)[number];
