import { Router } from "express";
import AdminController from "../controllers/admin.controller";
import AdminMiddleware from "../middlewares/admin.middleware";
import OwnerMiddleware from "../middlewares/owner.middleware";
import ProtectMiddleware from "../middlewares/protect.middleware";
import SitterMiddleware from "../middlewares/sitter.middleware";
import UserMiddleware from "../middlewares/user.middleware";
import SitterController from "../controllers/sitter.controller";

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
  "/pet-owner/:userId",
  [UserMiddleware.userId, ProtectMiddleware.admin],
  AdminController.getOwnerByUserId,
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

AdminRoute.get(
  "/pet-sitter/:sitterId",
  [SitterMiddleware.sitterId, ProtectMiddleware.admin],
  AdminController.getSitterById,
);

AdminRoute.get(
  "/pet-sitter/pending-update/:sitterId",
  [SitterMiddleware.sitterId, ProtectMiddleware.admin],
  AdminController.getPendingUpdateSitterById,
);

AdminRoute.patch(
  "/ban/:userId",
  [UserMiddleware.userId, ProtectMiddleware.admin],
  AdminController.banUser,
);

AdminRoute.patch(
  "/unban/:userId",
  [UserMiddleware.userId, ProtectMiddleware.admin],
  AdminController.unbanUser,
);

AdminRoute.patch(
  "/pet-sitter/approve/:sitterId",
  [SitterMiddleware.sitterId, ProtectMiddleware.admin],
  AdminController.approveUpdateSitter,
);

AdminRoute.delete(
  "/pet-sitter/reject/:sitterId",
  [SitterMiddleware.sitterId, ProtectMiddleware.admin],
  AdminController.rejectUpdateSitter,
);

AdminRoute.patch(
  "/pet-sitter/:sitterId/review",
  [
    SitterMiddleware.sitterId,
    SitterMiddleware.adminReviewSitterBody,
    ProtectMiddleware.admin,
  ],
  SitterController.adminReviewSitter,
);

export default AdminRoute;
