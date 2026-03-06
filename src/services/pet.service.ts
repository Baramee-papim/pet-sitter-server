import { format } from "date-fns";
import { UTCDate } from "@date-fns/utc";
import AppError from "../errors/AppError";
import PetRepository from "../repositories/pet.repository";
import supabaseAdmin from "../supabase/admin";
import { PetSex } from "../types/pet";

const bucket = "pet-assets";

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

  getPetTypes: async () => {
    return await PetRepository.getTypes();
  },

  createPet: async (
    userId: string,
    petName: string,
    petTypeId: number,
    sex: PetSex,
    breed: string,
    dateOfBirth: string,
    color: string,
    weight: string,
    about: string | null | undefined,
    file: Express.Multer.File,
  ) => {
    const lookupPetTypeIds = (await PetRepository.getTypes()).map(
      (petType) => petType.petTypeId,
    );

    if (!lookupPetTypeIds.includes(petTypeId)) {
      throw new AppError(404, "Pet type not found");
    }

    let filePath: string | undefined;

    try {
      // Upload pet image
      const now = new UTCDate();
      const fileExt = file.mimetype.split("/")[1];
      filePath = `${userId}/${petName}-${format(
        now,
        "yyyyMMddHHmmss",
      )}.${fileExt}`;

      const { error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(filePath, file.buffer, { contentType: file.mimetype });

      if (error) {
        throw error;
      }

      const { data } = supabaseAdmin.storage
        .from(bucket)
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      await PetRepository.create(
        userId,
        petName,
        petTypeId,
        sex,
        publicUrl,
        breed,
        dateOfBirth,
        color,
        weight,
        about,
      );
    } catch (error) {
      // Rollback
      if (filePath) {
        await supabaseAdmin.storage.from(bucket).remove([filePath]);
      }

      throw error;
    }
  },

  updatePet: async (
    userId: string,
    petId: number,
    petName: string,
    petTypeId: number,
    sex: PetSex,
    breed: string | undefined,
    dateOfBirth: string | undefined,
    color: string | undefined,
    weight: string | undefined,
    about: string | null | undefined,
    file: Express.Multer.File | undefined,
  ) => {
    const lookupPetTypeIds = (await PetRepository.getTypes()).map(
      (petType) => petType.petTypeId,
    );

    if (!lookupPetTypeIds.includes(petTypeId)) {
      throw new AppError(404, "Pet type not found");
    }

    const lookupPets = await PetRepository.getByUserId(userId);
    const lookupPetIds = lookupPets.map((pet) => pet.pets.petId);

    if (!lookupPetIds.includes(petId)) {
      throw new AppError(404, "Pet not found or not owned by this owner");
    }

    let filePath: string | undefined;

    try {
      // Upload pet image
      let publicUrl: string | undefined;

      if (file) {
        const now = new UTCDate();
        const fileExt = file.mimetype.split("/")[1];
        filePath = `${userId}/${petName.replace(" ", "")}-${format(
          now,
          "yyyyMMddHHmmss",
        )}.${fileExt}`;

        const { error } = await supabaseAdmin.storage
          .from(bucket)
          .upload(filePath, file.buffer, { contentType: file.mimetype });

        if (error) {
          throw error;
        }

        const { data } = supabaseAdmin.storage
          .from(bucket)
          .getPublicUrl(filePath);

        publicUrl = data.publicUrl;
      }

      const pet = lookupPets.filter((pet) => pet.pets.petId === petId)[0];

      await PetRepository.update(
        petId,
        petName,
        petTypeId,
        sex,
        publicUrl,
        breed,
        dateOfBirth,
        color,
        weight,
        about,
      );

      if (publicUrl) {
        await supabaseAdmin.storage
          .from(bucket)
          .remove([pet.pets.imgUrl.split(`/${bucket}/`)[1]]);
      }
    } catch (error) {
      // Rollback
      if (filePath) {
        await supabaseAdmin.storage.from(bucket).remove([filePath]);
      }

      throw error;
    }
  },

  deletePet: async (userId: string, petId: number) => {
    const lookupPets = await PetRepository.getByUserId(userId);
    const lookupPetIds = lookupPets.map((pet) => pet.pets.petId);

    if (!lookupPetIds.includes(petId)) {
      throw new AppError(404, "Pet not found or not owned by this owner");
    }

    await supabaseAdmin.storage
      .from(bucket)
      .remove([
        lookupPets
          .filter((pet) => pet.pets.petId === petId)[0]
          .pets.imgUrl.split(`/${bucket}/`)[1],
      ]);

    await PetRepository.delete(petId);
  },
};

export default PetService;
