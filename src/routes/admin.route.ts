import { Router } from "express";
import AdminController from "../controllers/admin.controller";
import AdminMiddleware from "../middlewares/admin.middleware";
import OwnerMiddleware from "../middlewares/owner.middleware";
import ProtectMiddleware from "../middlewares/protect.middleware";
import SitterMiddleware from "../middlewares/sitter.middleware";

const AdminRoute = Router();

AdminRoute.get(
  "/pet-owner",
  [
    AdminMiddleware.getOwnersQuery,
    OwnerMiddleware.getOwnersQuery,
    ProtectMiddleware.admin,
  ],
  AdminController.getOwners,
);

AdminRoute.get(
  "/pet-sitter",
  [
    AdminMiddleware.getSittersQuery,
    SitterMiddleware.getSittersQuery,
    ProtectMiddleware.admin,
  ],
  AdminController.getSitters,
);

export default AdminRoute;
