import db from "../db/db";
import { pets } from "../db/schema";
import { PetSex } from "../types/owner";

const OwnerRepository = {
  // TODO
  createPet: async (
    userId: string,
    petName: string,
    petTypeId: number,
    sex: PetSex,
    breed: string | null | undefined,
    dateOfBirth: string | null | undefined,
    color: string | null | undefined,
    weight: number | null | undefined,
    about: string | null | undefined,
  ) => {
    await db.insert(pets).values({
      userId,
      petName,
      petTypeId,
      sex,
      breed,
      dateOfBirth,
      color,
      weight: String(weight),
      about,
    });
  },
};

export default OwnerRepository;
