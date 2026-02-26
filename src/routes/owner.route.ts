import { Router } from "express";
import OwnerController from "../controllers/owner.controller";
import UserController from "../controllers/user.controller";
import OwnerMiddleware from "../middlewares/owner.middleware";
import ProtectMiddleware from "../middlewares/protect.middleware";
import UserMiddleware from "../middlewares/user.middleware";

const OwnerRoute = Router();

OwnerRoute.post(
  "/pet",
  [OwnerMiddleware.petBody, ProtectMiddleware.owner],
  OwnerController.createPet,
);

OwnerRoute.put(
  "/user",
  [UserMiddleware.updateUserBody, ProtectMiddleware.owner],
  UserController.updateUser,
);

export default OwnerRoute;
