import SitterRepository from "../repositories/sitter.repository";
import AppError from "../errors/AppError";
import BookingRepository from "../repositories/booking.repository";

const BookingService = {
  getBookings: async (loggedInUserId: string) => {
    const petSitter = await SitterRepository.getByUserId(loggedInUserId);
    if (!petSitter) throw new AppError(404, "Pet sitter not found");

    const bookings = await BookingRepository.getBookings({
      petSitterId: petSitter.petSitterId,
    }); //return [] (No booking)

    return bookings.map((booking) => ({
      bookingId: booking.bookingId,
      status: booking.status,
      startTime: booking.startTime,
      endTime: booking.endTime,
      totalPrice: booking.totalPrice,
      contactName: booking.contactName,
      contactPhone: booking.contactPhone,
      contactEmail: booking.contactEmail,
      note: booking.note,
    }));
  },

  getBookingById: async (bookingId: number, loggedInUserId: string) => {
    const booking = await BookingRepository.getBookingById(bookingId);

    if (!booking) {
      throw new AppError(404, "Booking not found");
    }

    const petSitter = await SitterRepository.getByUserId(loggedInUserId);
    if (!petSitter) throw new AppError(404, "Pet sitter not found");

    const lookupBookings = await BookingRepository.getBookings({
      petSitterId: petSitter.petSitterId,
    });
    const lookupBookingIds = lookupBookings.map((b) => b.bookingId);

    if (!lookupBookingIds.includes(bookingId)) {
      throw new AppError(404, "Booking not found or not owned by this sitter");
    }

    return {
      bookingId: booking.bookingId,
      status: booking.status,
      startTime: booking.startTime,
      endTime: booking.endTime,
      totalPrice: booking.totalPrice,
      contactName: booking.contactName,
      contactPhone: booking.contactPhone,
      contactEmail: booking.contactEmail,
      note: booking.note,
      // Pet owner info
      petOwnerName: booking.petOwnerName,
      petOwnerEmail: booking.petOwnerEmail,
      petOwnerPhone: booking.petOwnerPhone,
      petOwnerDateOfBirth: booking.petOwnerDateOfBirth,
      petOwnerProfileImg: booking.petOwnerProfileImg,
      // Pets with type and image
      pets: booking.pets,
    };
  },

  getOwnerBookingHistory: async (loggedInUserId: string) => {
    const bookings = await BookingRepository.getBookings({
      petOwnerId: loggedInUserId,
    });

    return Promise.all(
      bookings.map(async (booking) => {
        const full = await BookingRepository.getBookingById(booking.bookingId);
        return {
          bookingId: booking.bookingId,
          status: booking.status,
          startTime: booking.startTime,
          endTime: booking.endTime,
          totalPrice: booking.totalPrice,
          contactName: booking.contactName,
          contactPhone: booking.contactPhone,
          contactEmail: booking.contactEmail,
          createdAt: booking.createdAt,
          petSitterId: booking.petSitterId,
          note: booking.note,
          tradeName: full?.tradeName ?? null,
          sitterName: full?.sitterName ?? null,
          sitterImgUrl: full?.sitterImgUrl ?? null,
          pets: full?.pets ?? [],
          review: full?.review ?? null,
        };
      }),
    );
  },

  updateBookingStatus: async (
    bookingId: number,
    status: string,
    loggedInUserId: string,
  ) => {
    const petSitter = await SitterRepository.getByUserId(loggedInUserId);
    if (!petSitter) throw new AppError(404, "Pet sitter not found");

    const lookupBookings = await BookingRepository.getBookings({
      petSitterId: petSitter.petSitterId,
    });
    const lookupBookingIds = lookupBookings.map((b) => b.bookingId);

    if (!lookupBookingIds.includes(bookingId)) {
      throw new AppError(404, "Booking not found or not owned by this sitter");
    }

    const updated = await BookingRepository.updateBookingStatus(bookingId, status);
    if (!updated) throw new AppError(500, "Failed to update booking status");

    return updated;
  },
};

export default BookingService;
