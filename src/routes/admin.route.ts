import { Router } from "express";
import AdminController from "../controllers/admin.controller";
import AdminMiddleware from "../middlewares/admin.middleware";
import OwnerMiddleware from "../middlewares/owner.middleware";
import ProtectMiddleware from "../middlewares/protect.middleware";

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

export default AdminRoute;
