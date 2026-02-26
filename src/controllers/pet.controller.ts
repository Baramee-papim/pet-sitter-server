import { Request, Response } from "express";
import AppError from "../errors/AppError";
import AuthService from "../services/auth.service";
import PetService from "../services/pet.service";
import { PetBody, PetIdParams } from "../types/pet";

const PetController = {
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

      await PetService.createPet(
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

  // TODO image
  updatePet: async (req: Request<PetIdParams, {}, PetBody>, res: Response) => {
    const petId = Number(req.params.petId);
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

      await PetService.updatePet(
        result.data.user.id,
        petId,
        petName,
        petTypeId,
        sex,
        breed,
        dateOfBirth,
        color,
        weight,
        about,
      );
    } catch (error) {
      // Client error from service
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      return res.status(500).json({ error: "Internal server error" });
    }

    return res.status(200).json({ message: "Pet updated successfully" });
  },

  deletePet: async (req: Request<PetIdParams>, res: Response) => {
    const petId = Number(req.params.petId);
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    try {
      const result = await AuthService.getUser(token);

      await PetService.deletePet(result.data.user.id, petId);
    } catch (error) {
      // Client error from service
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      return res.status(500).json({ error: "Internal server error" });
    }

    return res.status(200).json({ message: "Pet deleted successfully" });
  },
};

export default PetController;
