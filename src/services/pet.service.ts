import { format } from "date-fns";
import { UTCDate } from "@date-fns/utc";
import AppError from "../errors/AppError";
import PetRepository from "../repositories/pet.repository";
import supabaseAdmin from "../supabase/admin";
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

    const now = new UTCDate();
    const fileExt = file.mimetype.split("/")[1];
    const fileName = `${userId}/${petName}-${format(
      now,
      "yyyyMMddHHmmss",
    )}.${fileExt}`;

    await supabaseAdmin.storage
      .from("pet-assets")
      .upload(fileName, file.buffer, { contentType: file.mimetype });

    const { data } = supabaseAdmin.storage
      .from("pet-assets")
      .getPublicUrl(fileName);

    await PetRepository.create(
      userId,
      petName,
      petTypeId,
      sex,
      data.publicUrl,
      breed,
      dateOfBirth,
      color,
      weight,
      about,
    );
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

    let newImgUrl: string | undefined = undefined;

    if (file) {
      const now = new UTCDate();
      const fileExt = file.mimetype.split("/")[1];
      const fileName = `${userId}/${petName}-${format(
        now,
        "yyyyMMddHHmmss",
      )}.${fileExt}`;

      await supabaseAdmin.storage
        .from("pet-assets")
        .upload(fileName, file.buffer, { contentType: file.mimetype });

      const { data } = supabaseAdmin.storage
        .from("pet-assets")
        .getPublicUrl(fileName);

      newImgUrl = data.publicUrl;

      const oldPath = lookupPets
        .filter((pet) => pet.pets.petId === petId)[0]
        .pets.imgUrl.split("/pet-assets/")[1];

      await supabaseAdmin.storage.from("pet-assets").remove([oldPath]);
    }

    await PetRepository.update(
      petId,
      petName,
      petTypeId,
      sex,
      newImgUrl,
      breed,
      dateOfBirth,
      color,
      weight,
      about,
    );
  },

  deletePet: async (userId: string, petId: number) => {
    const lookupPets = await PetRepository.getByUserId(userId);
    const lookupPetIds = lookupPets.map((pet) => pet.pets.petId);

    if (!lookupPetIds.includes(petId)) {
      throw new AppError(404, "Pet not found or not owned by this owner");
    }

    const oldPath = lookupPets
      .filter((pet) => pet.pets.petId === petId)[0]
      .pets.imgUrl.split("/pet-assets/")[1];

    await supabaseAdmin.storage.from("pet-assets").remove([oldPath]);

    await PetRepository.delete(petId);
  },
};

export default PetService;
