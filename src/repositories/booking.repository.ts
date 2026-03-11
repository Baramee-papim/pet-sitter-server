import { eq, and } from "drizzle-orm";
import db from "../db/db";
import { bookings, bookingsPets } from "../db/schema";

interface GetBookingsFilter {
  petSitterId?: number;
  petOwnerId?: string;
}

export const getBookings = async (filter: GetBookingsFilter) => {
  const conditions = [];

  if (filter.petSitterId) {
    conditions.push(eq(bookings.petSitterId, filter.petSitterId));
  }

  if (filter.petOwnerId) {
    conditions.push(eq(bookings.petOwnerId, filter.petOwnerId));
  }

  const result = await db
    .select()
    .from(bookings)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  return result;
};

export const getBookingById = async (bookingId: number) => {
  const booking = await db.query.bookings.findFirst({
    where: (bookings, { eq }) => eq(bookings.bookingId, bookingId),
  });

  if (!booking) return null;

  const pets = await db
    .select()
    .from(bookingsPets)
    .where(eq(bookingsPets.bookingId, bookingId));

  return { ...booking, pets };
};
