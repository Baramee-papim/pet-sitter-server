import { ParamsDictionary } from "express-serve-static-core";
import { pets } from "../db/schema";

export type PetSex = (typeof pets.$inferSelect)["sex"];

export const PET_SEXES: readonly PetSex[] = ["Male", "Female", "Unknown"];

export interface PetIdParams extends ParamsDictionary {
  petId: string;
}

export interface PetBody {
  petName: string;
  petTypeId: number;
  sex: PetSex;
  breed?: string | null;
  dateOfBirth?: string | null;
  color?: string | null;
  weight?: number | null;
  about?: string | null;
}
