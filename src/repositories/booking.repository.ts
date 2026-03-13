import { eq, and } from "drizzle-orm";
import db from "../db/db";
import { bookings, bookingsPets, petSitters, users } from "../db/schema";
import { GetBookingsFilter } from "../types/booking";

const BookingRepository = {
  getBookings: async (filter: GetBookingsFilter) => {
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
  },

  getBookingById: async (bookingId: number) => {
    const booking = await db.query.bookings.findFirst({
      where: (bookings, { eq }) => eq(bookings.bookingId, bookingId),
    });

    if (!booking) return null;

    const pets = await db
      .select()
      .from(bookingsPets)
      .where(eq(bookingsPets.bookingId, bookingId));

    const review = await db.query.reviews.findFirst({
      where: (reviews, { eq }) => eq(reviews.bookingId, bookingId),
    });

    const sitter = await db
      .select({
        tradeName: petSitters.tradeName,
        sitterName: users.name,
        sitterImgUrl: users.profileImgUrl,
      })
      .from(petSitters)
      .innerJoin(users, eq(users.userId, petSitters.userId))
      .where(eq(petSitters.petSitterId, booking.petSitterId))
      .limit(1)
      .then((rows) => rows[0] ?? null);

    const petOwner = await db
      .select({
        petOwnerName: users.name,
        petOwnerEmail: users.email,
        petOwnerPhone: users.phone,
        petOwnerDateOfBirth: users.dateOfBirth,
        petOwnerProfileImg: users.profileImgUrl,
      })
      .from(users)
      .where(eq(users.userId, booking.petOwnerId))
      .limit(1)
      .then((rows) => rows[0] ?? null);

    return {
      ...booking,
      pets,
      review: review ?? null,
      tradeName: sitter?.tradeName ?? null,
      sitterName: sitter?.sitterName ?? null,
      sitterImgUrl: sitter?.sitterImgUrl ?? null,
      petOwnerName: petOwner?.petOwnerName ?? null,
      petOwnerEmail: petOwner?.petOwnerEmail ?? null,
      petOwnerPhone: petOwner?.petOwnerPhone ?? null,
      petOwnerDateOfBirth: petOwner?.petOwnerDateOfBirth ?? null,
      petOwnerProfileImg: petOwner?.petOwnerProfileImg ?? null,
    };
  },
  updateBookingStatus: async (bookingId: number, status: string) => {
    const result = await db
      .update(bookings)
      .set({ status: status as any, updatedAt: new Date().toISOString() })
      .where(eq(bookings.bookingId, bookingId))
      .returning();

    return result[0] ?? null;
  },
};

export default BookingRepository;
