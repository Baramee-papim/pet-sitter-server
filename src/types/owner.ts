import { pets } from "../db/schema";

export type PetSex = (typeof pets.$inferSelect)["sex"];

export const PET_SEXES: readonly PetSex[] = ["Male", "Female", "Unknown"];

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
