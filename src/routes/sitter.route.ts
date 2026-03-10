import { Router } from "express";
import SitterController from "../controllers/sitter.controller";
import UserController from "../controllers/user.controller";
import ProtectMiddleware from "../middlewares/protect.middleware";
import SitterMiddleware from "../middlewares/sitter.middleware";
import UploadMiddleware from "../middlewares/upload.middleware";
import UserMiddleware from "../middlewares/user.middleware";
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
  "/booking/:bookingId",
  [ProtectMiddleware.sitter],
  BookingController.getBookingById,
);

SitterRoute.get(
  "/:sitterId",
  [SitterMiddleware.sitterId],
  SitterController.getSitterById,
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
