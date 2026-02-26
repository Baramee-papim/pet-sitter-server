import { Router } from "express";
import SitterController from "../controllers/sitter.controller";
import UserController from "../controllers/user.controller";
import ProtectMiddleware from "../middlewares/protect.middleware";
import SitterMiddleware from "../middlewares/sitter.middleware";
import UserMiddleware from "../middlewares/user.middleware";

const SitterRoute = Router();

SitterRoute.get(
  "/",
  SitterMiddleware.getSittersQuery,
  SitterController.getSitters,
);

SitterRoute.get(
  "/:sitterId",
  SitterMiddleware.sitterId,
  SitterController.getSitterById,
);

SitterRoute.put(
  "/",
  SitterMiddleware.updateSitterBody,
  ProtectMiddleware.sitter,
  SitterController.updateSitter,
);

SitterRoute.put(
  "/user",
  UserMiddleware.updateUserBody,
  ProtectMiddleware.sitter,
  UserController.updateUser,
);

export default SitterRoute;
