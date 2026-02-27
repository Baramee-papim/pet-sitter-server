import { Router } from "express";
import PetController from "../controllers/pet.controller";
import UserController from "../controllers/user.controller";
import PetMiddleware from "../middlewares/pet.middleware";
import ProtectMiddleware from "../middlewares/protect.middleware";
import UploadMiddleware from "../middlewares/upload.middleware";
import UserMiddleware from "../middlewares/user.middleware";

const OwnerRoute = Router();

OwnerRoute.get("/pet", [ProtectMiddleware.owner], PetController.getPets);

OwnerRoute.get(
  "/pet/:petId",
  [PetMiddleware.petId, ProtectMiddleware.owner],
  PetController.getPetById,
);

OwnerRoute.post(
  "/pet",
  [PetMiddleware.petBody, ProtectMiddleware.owner],
  PetController.createPet,
);

OwnerRoute.put(
  "/pet/:petId",
  [PetMiddleware.petId, PetMiddleware.petBody, ProtectMiddleware.owner],
  PetController.updatePet,
);

OwnerRoute.put(
  "/user",
  [
    UploadMiddleware.image.single("image"),
    UserMiddleware.updateUserBody,
    ProtectMiddleware.owner,
  ],
  UserController.updateUser,
);

OwnerRoute.delete(
  "/pet/:petId",
  [PetMiddleware.petId, ProtectMiddleware.owner],
  PetController.deletePet,
);

export default OwnerRoute;
