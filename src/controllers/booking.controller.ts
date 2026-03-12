import { User } from "@supabase/supabase-js";
import { UserRole } from "../types/user";
import { Request, Response } from "express";
import BookingService from "../services/booking.service";
type RequestWithUser = Request & { user?: User & { role: UserRole } };
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
};

export default BookingController;
