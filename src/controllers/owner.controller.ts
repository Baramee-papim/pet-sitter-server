import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import OwnerService from "../services/owner.service";
import { PetBody } from "../types/owner";

const OwnerController = {
  // TODO image
  createPet: async (req: Request<{}, {}, PetBody>, res: Response) => {
    const {
      petName,
      petTypeId,
      sex,
      breed,
      dateOfBirth,
      color,
      weight,
      about,
    } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    try {
      const result = await AuthService.getUser(token);

      await OwnerService.createPet(
        result.data.user.id,
        petName,
        petTypeId,
        sex,
        breed,
        dateOfBirth,
        color,
        weight,
        about,
      );
    } catch {
      return res.status(500).json({ error: "Internal server error" });
    }

    return res.status(201).json({ message: "Pet created successfully" });
  },
};

export default OwnerController;
