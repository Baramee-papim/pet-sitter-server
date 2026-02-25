import {
  pgTable,
  index,
  foreignKey,
  pgPolicy,
  integer,
  varchar,
  check,
  serial,
  uuid,
  text,
  timestamp,
  unique,
  numeric,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const petSitterStatus = pgEnum("pet_sitter_status", [
  "Waiting for approval",
  "Approved",
  "Rejected",
]);
export const userRole = pgEnum("user_role", ["owner", "sitter", "admin"]);
export const userStatus = pgEnum("user_status", ["Normal", "Banned"]);

export const districts = pgTable(
  "districts",
  {
    districtId: integer("district_id").primaryKey().notNull(),
    provinceId: integer("province_id").notNull(),
    name: varchar({ length: 120 }).notNull(),
  },
  (table) => [
    index("districts_province_id_idx").using(
      "btree",
      table.provinceId.asc().nullsLast().op("int4_ops"),
    ),
    foreignKey({
      columns: [table.provinceId],
      foreignColumns: [provinces.provinceId],
      name: "districts_province_id_fkey",
    }).onDelete("cascade"),
    pgPolicy("Enable read access for all users", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`true`,
    }),
  ],
);

export const provinces = pgTable(
  "provinces",
  {
    provinceId: integer("province_id").primaryKey().notNull(),
    name: varchar({ length: 120 }).notNull(),
  },
  (table) => [
    pgPolicy("Enable read access for all users", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`true`,
    }),
  ],
);

export const subDistricts = pgTable(
  "sub_districts",
  {
    subDistrictId: integer("sub_district_id").primaryKey().notNull(),
    districtId: integer("district_id").notNull(),
    name: varchar({ length: 120 }).notNull(),
    postCode: integer("post_code").notNull(),
  },
  (table) => [
    index("sub_districts_district_id_idx").using(
      "btree",
      table.districtId.asc().nullsLast().op("int4_ops"),
    ),
    foreignKey({
      columns: [table.districtId],
      foreignColumns: [districts.districtId],
      name: "sub_districts_district_id_fkey",
    }).onDelete("cascade"),
    pgPolicy("Enable read access for all users", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`true`,
    }),
  ],
);

export const petSitterReviews = pgTable(
  "pet_sitter_reviews",
  {
    petSitterReviewId: serial("pet_sitter_review_id").primaryKey().notNull(),
    petSitterId: integer("pet_sitter_id").notNull(),
    userId: uuid("user_id").notNull(),
    rating: integer().notNull(),
    comment: text().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("pet_sitter_reviews_pet_sitter_id_idx").using(
      "btree",
      table.petSitterId.asc().nullsLast().op("int4_ops"),
    ),
    index("pet_sitter_reviews_user_id_idx").using(
      "btree",
      table.userId.asc().nullsLast().op("uuid_ops"),
    ),
    foreignKey({
      columns: [table.petSitterId],
      foreignColumns: [petSitters.petSitterId],
      name: "pet_sitter_reviews_pet_sitter_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.userId],
      name: "pet_sitter_reviews_user_id_fkey",
    }).onDelete("cascade"),
    check(
      "pet_sitter_reviews_rating_check",
      sql`rating = ANY (ARRAY[1, 2, 3, 4, 5])`,
    ),
  ],
);

export const users = pgTable(
  "users",
  {
    userId: uuid("user_id").primaryKey().notNull(),
    name: varchar({ length: 100 }).notNull(),
    phone: varchar({ length: 10 }).notNull(),
    role: userRole().default("owner").notNull(),
    profileImgUrl: text("profile_img_url"),
    status: userStatus().default("Normal").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique("users_phone_key").on(table.phone)],
);

export const petTypes = pgTable(
  "pet_types",
  {
    petTypeId: serial("pet_type_id").primaryKey().notNull(),
    name: varchar({ length: 16 }).notNull(),
  },
  (table) => [
    unique("pet_types_name_key").on(table.name),
    pgPolicy("Enable read access for all users", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`true`,
    }),
  ],
);

export const petSitters = pgTable(
  "pet_sitters",
  {
    petSitterId: serial("pet_sitter_id").primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    experience: numeric({ precision: 3, scale: 1 }),
    tradeName: varchar("trade_name", { length: 50 }),
    introduction: text(),
    services: text(),
    description: text(),
    address: varchar({ length: 100 }),
    latitude: numeric({ precision: 9, scale: 6 }),
    longitude: numeric({ precision: 9, scale: 6 }),
    provinceId: integer("province_id"),
    districtId: integer("district_id"),
    subDistrictId: integer("sub_district_id"),
    status: petSitterStatus().default("Waiting for approval").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("pet_sitters_district_id_idx").using(
      "btree",
      table.districtId.asc().nullsLast().op("int4_ops"),
    ),
    index("pet_sitters_province_id_idx").using(
      "btree",
      table.provinceId.asc().nullsLast().op("int4_ops"),
    ),
    index("pet_sitters_sub_district_id_idx").using(
      "btree",
      table.subDistrictId.asc().nullsLast().op("int4_ops"),
    ),
    foreignKey({
      columns: [table.districtId],
      foreignColumns: [districts.districtId],
      name: "pet_sitters_district_id_fkey",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.provinceId],
      foreignColumns: [provinces.provinceId],
      name: "pet_sitters_province_id_fkey",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.subDistrictId],
      foreignColumns: [subDistricts.subDistrictId],
      name: "pet_sitters_sub_district_id_fkey",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.userId],
      name: "pet_sitters_user_id_fkey",
    }).onDelete("cascade"),
    unique("pet_sitters_user_id_key").on(table.userId),
    unique("pet_sitters_trade_name_key").on(table.tradeName),
  ],
);

export const petSitterImages = pgTable(
  "pet_sitter_images",
  {
    petSitterImageId: serial("pet_sitter_image_id").primaryKey().notNull(),
    petSitterId: integer("pet_sitter_id").notNull(),
    imgUrl: text("img_url").notNull(),
  },
  (table) => [
    index("pet_sitter_images_pet_sitter_id_idx").using(
      "btree",
      table.petSitterId.asc().nullsLast().op("int4_ops"),
    ),
    foreignKey({
      columns: [table.petSitterId],
      foreignColumns: [petSitters.petSitterId],
      name: "pet_sitter_images_pet_sitter_id_fkey",
    }).onDelete("cascade"),
  ],
);

export const petSittersPetTypes = pgTable(
  "pet_sitters_pet_types",
  {
    petSitterId: integer("pet_sitter_id").notNull(),
    petTypeId: integer("pet_type_id").notNull(),
  },
  (table) => [
    index("pet_sitters_pet_types_pet_sitter_id_idx").using(
      "btree",
      table.petSitterId.asc().nullsLast().op("int4_ops"),
    ),
    index("pet_sitters_pet_types_pet_type_id_idx").using(
      "btree",
      table.petTypeId.asc().nullsLast().op("int4_ops"),
    ),
    foreignKey({
      columns: [table.petSitterId],
      foreignColumns: [petSitters.petSitterId],
      name: "pet_sitters_pet_types_pet_sitter_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.petTypeId],
      foreignColumns: [petTypes.petTypeId],
      name: "pet_sitters_pet_types_pet_type_id_fkey",
    }),
    primaryKey({
      columns: [table.petSitterId, table.petTypeId],
      name: "pet_sitters_pet_types_pkey",
    }),
  ],
);
