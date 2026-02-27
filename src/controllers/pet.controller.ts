import { Request, Response } from "express";
import AppError from "../errors/AppError";
import AuthService from "../services/auth.service";
import PetService from "../services/pet.service";
import { PetBody, PetIdParams } from "../types/pet";

const PetController = {
  getPets: async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    let result;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    try {
      const user = await AuthService.getUser(token);

      result = await PetService.getPetsByUserId(user.data.user.id);
    } catch (error) {
      // Client error from service
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      return res.status(500).json({ error: "Internal server error" });
    }

    const petsResponse = result.map((pet) => ({
      id: pet.pets.petId,
      imgUrl: pet.pets.imgUrl,
      petName: pet.pets.petName,
      petType: pet.pet_types.name,
    }));

    return res.status(200).json(petsResponse);
  },

  getPetById: async (req: Request<PetIdParams>, res: Response) => {
    const petId = Number(req.params.petId);
    const token = req.headers.authorization?.split(" ")[1];
    let result;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    try {
      const user = await AuthService.getUser(token);

      result = await PetService.getPetById(user.data.user.id, petId);
    } catch (error) {
      // Client error from service
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      return res.status(500).json({ error: "Internal server error" });
    }

    const petResponse = {
      id: result.pets.petId,
      imgUrl: result.pets.imgUrl,
      petName: result.pets.petName,
      petType: result.pet_types.name,
      sex: result.pets.sex,
      breed: result.pets.breed,
      dateOfBirth: result.pets.dateOfBirth,
      color: result.pets.color,
      weight: result.pets.weight,
      about: result.pets.about,
    };

    return res.status(200).json(petResponse);
  },

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
      const user = await AuthService.getUser(token);

      await PetService.createPet(
        user.data.user.id,
        petName.trim(),
        petTypeId,
        sex,
        breed ? breed.trim() : breed,
        dateOfBirth,
        color ? color.trim() : color,
        typeof weight === "number" ? String(weight) : weight,
        about ? about.trim() : about,
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
      const user = await AuthService.getUser(token);

      await PetService.updatePet(
        user.data.user.id,
        petId,
        petName.trim(),
        petTypeId,
        sex,
        breed ? breed.trim() : breed,
        dateOfBirth,
        color ? color.trim() : color,
        typeof weight === "number" ? String(weight) : weight,
        about ? about.trim() : about,
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
      const user = await AuthService.getUser(token);

      await PetService.deletePet(user.data.user.id, petId);
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
