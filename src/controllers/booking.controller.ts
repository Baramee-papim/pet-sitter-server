import { Response, NextFunction } from "express";
import BookingService from "../services/booking.service";
import AppError from "../errors/AppError";
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

  updateBookingStatus: async (req: RequestWithUser, res: Response) => {
    try {
      const bookingId = Number(req.params.bookingId);
      const { status } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }

      const result = await BookingService.updateBookingStatus(
        bookingId,
        status,
        userId,
      );

      return res.status(200).json({ data: result });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default BookingController;
