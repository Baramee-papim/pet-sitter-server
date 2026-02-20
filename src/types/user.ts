import { users } from "../db/schema";

export type UserRole = (typeof users.$inferSelect)["role"];

export const USER_ROLES: readonly UserRole[] = ["owner", "sitter", "admin"];
