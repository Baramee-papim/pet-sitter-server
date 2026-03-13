import { Response, NextFunction } from "express";
import BookingService from "../services/booking.service";
import { RequestWithUser } from "../types/booking";

const BookingController = {
  getBookings: async (req: RequestWithUser, res: Response) => {
    try {
      const userId = req.user!.id;
      const result = await BookingService.getBookings(userId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getBookingById: async (req: RequestWithUser, res: Response) => {
    try {
      const bookingId = Number(req.params.bookingId);
      const userId = req.user!.id;

      const result = await BookingService.getBookingById(bookingId, userId);

      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === "Booking not found") {
        return res.status(404).json({ message: error.message });
      }
      if (error.message.startsWith("Forbidden")) {
        return res.status(403).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getOwnerBookingHistory: async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;
      const result = await BookingService.getOwnerBookingHistory(userId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};

export default BookingController;
