import { asc, eq } from "drizzle-orm";
import db from "../db/db";
import { pets, petTypes } from "../db/schema";
import { PetSex } from "../types/pet";

const PetRepository = {
  getByUserId: async (userId: string) => {
    return db
      .select()
      .from(pets)
      .innerJoin(petTypes, eq(petTypes.petTypeId, pets.petTypeId))
      .where(eq(pets.userId, userId))
      .orderBy(asc(pets.petId));
  },

  // TODO image
  create: async (
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
    await db.insert(pets).values({
      userId,
      petName,
      petTypeId,
      sex,
      breed,
      dateOfBirth,
      color,
      weight,
      about,
    });
  },

  // TODO image
  update: async (
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
    await db
      .update(pets)
      .set({
        petName,
        petTypeId,
        sex,
        breed,
        dateOfBirth,
        color,
        weight,
        about,
      })
      .where(eq(pets.petId, petId));
  },

  // TODO image
  delete: async (petId: number) => {
    await db.delete(pets).where(eq(pets.petId, petId));
  },
};

export default PetRepository;
