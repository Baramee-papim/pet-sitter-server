import { users } from "../db/schema";

export type UserRole = (typeof users.$inferSelect)["role"];

export const USER_ROLES: readonly UserRole[] = ["owner", "sitter", "admin"];

export interface UpdateUserBody {
  name: string;
  phone: string;
  idNumber?: string | null;
  dateOfBirth?: string | null;
  email?: string;
  password?: string;
  removeProfileImg?: boolean;
}
