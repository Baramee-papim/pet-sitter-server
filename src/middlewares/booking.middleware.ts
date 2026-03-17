import { Request, Response, NextFunction } from "express";
import {
  UpdateBookingTimeParams,
  UpdateBookingTimeBody,
} from "@/types/booking";

const BookingMiddleware = {
  UpdateBookingTime: (
    req: Request<UpdateBookingTimeParams, unknown, UpdateBookingTimeBody>,
    res: Response,
    next: NextFunction,
  ) => {
    const { startTime, endTime } = req.body;
    const { bookingId } = req.params;

    if (!bookingId || isNaN(Number(bookingId))) {
      return res.status(400).json({ message: "Invalid bookingId" });
    }

    if (!startTime || !endTime) {
      return res
        .status(400)
        .json({ message: "startTime and endTime are required" });
    }

    if (isNaN(Date.parse(startTime)) || isNaN(Date.parse(endTime))) {
      return res.status(400).json({ message: "Invalid timestamp format" });
    }

    if (new Date(endTime) <= new Date(startTime)) {
      return res
        .status(400)
        .json({ message: "endTime must be after startTime" });
    }

    next();
  },
};

export default BookingMiddleware;
