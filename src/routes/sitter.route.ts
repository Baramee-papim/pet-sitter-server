import { Router } from "express";
import SitterController from "../controllers/sitter.controller";
import UserController from "../controllers/user.controller";
import ProtectMiddleware from "../middlewares/protect.middleware";
import SitterMiddleware from "../middlewares/sitter.middleware";
import UploadMiddleware from "../middlewares/upload.middleware";
import UserMiddleware from "../middlewares/user.middleware";
import ReviewMiddleware from "../middlewares/review.middleware";
import ReviewController from "../controllers/review.controller";
import BookingController from "../controllers/booking.controller";

const SitterRoute = Router();

SitterRoute.get(
  "/",
  [SitterMiddleware.getSittersQuery],
  SitterController.getSitters,
);

SitterRoute.get(
  "/profile",
  [ProtectMiddleware.sitter],
  SitterController.getSitterProfile,
);

SitterRoute.get(
  "/bookings",
  [ProtectMiddleware.sitter],
  BookingController.getBookings,
);

SitterRoute.get(
  "/bookings/:bookingId",
  [ProtectMiddleware.sitter],
  BookingController.getBookingById,
);

SitterRoute.get(
  "/:sitterId",
  [SitterMiddleware.sitterId],
  SitterController.getSitterById,
);

SitterRoute.get(
  "/:sitterId/reviews",
  [
    SitterMiddleware.sitterId,
    ReviewMiddleware.getReviewsQuery
  ],
  ReviewController.getReviewsBySitterId,
);

SitterRoute.put(
  "/user",
  [
    UploadMiddleware.image.single("image"),
    UserMiddleware.updateUserBody,
    ProtectMiddleware.sitter,
  ],
  UserController.updateUser,
);

SitterRoute.put(
  "/profile",
  [
    UploadMiddleware.uploadImages,
    SitterMiddleware.updateSitterBody,
    ProtectMiddleware.sitter,
  ],
  SitterController.updateSitter,
);

export default SitterRoute;
