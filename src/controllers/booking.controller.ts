import { Response, NextFunction } from "express";
import BookingService from "../services/booking.service";
import AppError from "../errors/AppError";
import {
  GetBookingListsQuery,
  RequestWithUser,
  UpdateBookingTimeRequest,
} from "../types/booking";
import parsePositiveInt from "../utils/parsePositiveInt";

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

  getBookingLists: async (req: RequestWithUser, res: Response) => {
    try {
      const userId = req.user!.id;
      const keyword = (req.query.keyword as string) || "";

      const currentPage = parsePositiveInt(req.query.page, 1);
      const limit = parsePositiveInt(req.query.limit, 10, 20);

      const allowedStatuses = [
        "waiting_confirm",
        "waiting_service",
        "in_service",
        "completed",
        "canceled",
      ] as const;

      const rawStatus = (req.query.status as string) || "";
      const status =
        rawStatus.toLowerCase() === "all" ||
        !allowedStatuses.includes(rawStatus as any)
          ? ""
          : rawStatus;

      const query: GetBookingListsQuery = {
        keyword,
        status,
        currentPage,
        limit,
      };

      const { bookings, total, totalPages } =
        await BookingService.getBookingLists(userId, query);

      const response = {
        bookings,
        totalPages: totalPages,
        currentPage: currentPage,
        limit: limit,
        total: total,
      };
      res.status(200).json(response);
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

  updateBookingTime: async (req: UpdateBookingTimeRequest, res: Response) => {
    try {
      const bookingId = Number(req.params.bookingId);
      const { startTime, endTime } = req.body;

      const updated = await BookingService.updateBookingTime({
        bookingId,
        startTime,
        endTime,
      });

      if (!updated) {
        return res.status(404).json({ message: "Booking not found" });
      }

      return res.status(200).json(updated);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default BookingController;
