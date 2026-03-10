import { Router } from "express";
import SitterController from "../controllers/sitter.controller";
import UserController from "../controllers/user.controller";
import ProtectMiddleware from "../middlewares/protect.middleware";
import SitterMiddleware from "../middlewares/sitter.middleware";
import UploadMiddleware from "../middlewares/upload.middleware";
import UserMiddleware from "../middlewares/user.middleware";

const SitterRoute = Router();

SitterRoute.get(
  "/",
  [SitterMiddleware.getSittersQuery],
  SitterController.getSitters,
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

SitterRoute.get(
  "/:sitterId",
  [SitterMiddleware.sitterId],
  SitterController.getSitterById,
);

SitterRoute.put(
  "/:sitterId",
  [
    UploadMiddleware.uploadImages,
    SitterMiddleware.updateSitterBody,
    ProtectMiddleware.sitter,
  ],
  SitterController.updateSitter,
);

export default SitterRoute;
