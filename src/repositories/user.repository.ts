import { eq } from "drizzle-orm";
import db from "../db/db";
import { users } from "../db/schema";
import { UserRole } from "../types/user";

const UserRepository = {
  getById: async (userId: string) => {
    return await db.select().from(users).where(eq(users.userId, userId));
  },

  getByPhone: async (phone: string) => {
    return await db.select().from(users).where(eq(users.phone, phone));
  },

  create: async (userId: string, phone: string, role: UserRole) => {
    const defaultName = role === "owner" ? "New Guest" : "New Sitter";

    await db.insert(users).values({ userId, name: defaultName, phone, role });
  },
};

export default UserRepository;
