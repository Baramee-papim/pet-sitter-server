import {
  pgTable,
  unique,
  uuid,
  varchar,
  text,
  pgEnum,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["owner", "sitter", "admin"]);

export const users = pgTable(
  "users",
  {
    userId: uuid("user_id").primaryKey().notNull(),
    name: varchar({ length: 100 }).notNull(),
    phone: varchar({ length: 10 }).notNull(),
    role: userRole().default("owner").notNull(),
    profileImgUrl: text("profile_img_url"),
  },
  (table) => [unique("users_phone_idx").on(table.phone)],
);
