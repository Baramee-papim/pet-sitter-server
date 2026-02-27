import AppError from "../errors/AppError";
import PetRepository from "../repositories/pet.repository";
import { PetSex } from "../types/pet";

const PetService = {
  getPetsByUserId: async (userId: string) => {
    return await PetRepository.getByUserId(userId);
  },

  getPetById: async (userId: string, petId: number) => {
    const result = await PetRepository.getByUserId(userId);

    if (!result.map((pet) => pet.pets.petId).includes(petId)) {
      throw new AppError(404, "Pet not found or not owned by this owner");
    }

    return result.filter((pet) => pet.pets.petId === petId)[0];
  },

  // TODO image
  createPet: async (
    userId: string,
    petName: string,
    petTypeId: number,
    sex: PetSex,
    breed: string | null | undefined,
    dateOfBirth: string | null | undefined,
    color: string | null | undefined,
    weight: string | null | undefined,
    about: string | null | undefined,
  ) => {
    await PetRepository.create(
      userId,
      petName,
      petTypeId,
      sex,
      breed,
      dateOfBirth,
      color,
      weight,
      about,
    );
  },

  // TODO image
  updatePet: async (
    userId: string,
    petId: number,
    petName: string,
    petTypeId: number,
    sex: PetSex,
    breed: string | null | undefined,
    dateOfBirth: string | null | undefined,
    color: string | null | undefined,
    weight: string | null | undefined,
    about: string | null | undefined,
  ) => {
    const lookupPetIds = (await PetRepository.getByUserId(userId)).map(
      (pet) => pet.pets.petId,
    );

    if (!lookupPetIds.includes(petId)) {
      throw new AppError(404, "Pet not found or not owned by this owner");
    }

    await PetRepository.update(
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
  },

  deletePet: async (userId: string, petId: number) => {
    const lookupPetIds = (await PetRepository.getByUserId(userId)).map(
      (pet) => pet.pets.petId,
    );

    if (!lookupPetIds.includes(petId)) {
      throw new AppError(404, "Pet not found or not owned by this owner");
    }

    await PetRepository.delete(petId);
  },
};

export default PetService;
