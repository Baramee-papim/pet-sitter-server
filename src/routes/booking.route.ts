import { Router } from "express";
import BookingController from "../controllers/booking.controller";
import ProtectMiddleware from "../middlewares/protect.middleware";

const BookingRouter = Router();

BookingRouter.get(
  "/owner/history",
  [ProtectMiddleware.owner],
  BookingController.getOwnerBookingHistory,
);

export default BookingRouter;
