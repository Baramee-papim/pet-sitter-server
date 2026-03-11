import {
  getBookingById,
  getBookings,
} from "../repositories/booking.repository";
import SitterRepository from "../repositories/sitter.repository";
import AppError from "../errors/AppError";

const BookingService = {
  getBookings: async (loggedInUserId: string) => {
    const petSitter = await SitterRepository.getByUserId(loggedInUserId);
    if (!petSitter) throw new AppError(404, "Pet sitter not found");

    const bookings = await getBookings({
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
    const booking = await getBookingById(bookingId);

    if (!booking) {
      throw new AppError(404, "Booking not found");
    }

    const petSitter = await SitterRepository.getByUserId(loggedInUserId);
    if (!petSitter) throw new AppError(404, "Pet sitter not found");

    const lookupBookings = await getBookings({
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
      pets: booking.pets,
    };
  },
};

export default BookingService;
