import { Router } from "express";
import UserController from "../controllers/user.controller";
import ProtectMiddleware from "../middlewares/protect.middleware";
import UserMiddleware from "../middlewares/user.middleware";

const OwnerRoute = Router();

OwnerRoute.put(
  "/user",
  UserMiddleware.updateUserBody,
  ProtectMiddleware.owner,
  UserController.updateUser,
);

export default OwnerRoute;
