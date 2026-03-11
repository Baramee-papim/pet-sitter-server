import { eq } from "drizzle-orm";
import db from "../db/db";
import { bookingsPets } from "../db/schema";

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
