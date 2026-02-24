import { Router } from "express";
import SitterController from "../controllers/sitter.controller";
import SitterMiddleware from "../middlewares/sitter.middleware";

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

export default SitterRoute;
