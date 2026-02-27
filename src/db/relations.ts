import { relations } from "drizzle-orm/relations";
import {
  provinces,
  districts,
  subDistricts,
  petSitters,
  petSitterReviews,
  users,
  petSitterImages,
  petTypes,
  pets,
  petSittersPetTypes,
} from "./schema";

export const districtsRelations = relations(districts, ({ one, many }) => ({
  province: one(provinces, {
    fields: [districts.provinceId],
    references: [provinces.provinceId],
  }),
  subDistricts: many(subDistricts),
  petSitters: many(petSitters),
}));

export const provincesRelations = relations(provinces, ({ many }) => ({
  districts: many(districts),
  petSitters: many(petSitters),
}));

export const subDistrictsRelations = relations(
  subDistricts,
  ({ one, many }) => ({
    district: one(districts, {
      fields: [subDistricts.districtId],
      references: [districts.districtId],
    }),
    petSitters: many(petSitters),
  }),
);

export const petSitterReviewsRelations = relations(
  petSitterReviews,
  ({ one }) => ({
    petSitter: one(petSitters, {
      fields: [petSitterReviews.petSitterId],
      references: [petSitters.petSitterId],
    }),
    user: one(users, {
      fields: [petSitterReviews.userId],
      references: [users.userId],
    }),
  }),
);

export const petSittersRelations = relations(petSitters, ({ one, many }) => ({
  petSitterReviews: many(petSitterReviews),
  district: one(districts, {
    fields: [petSitters.districtId],
    references: [districts.districtId],
  }),
  province: one(provinces, {
    fields: [petSitters.provinceId],
    references: [provinces.provinceId],
  }),
  subDistrict: one(subDistricts, {
    fields: [petSitters.subDistrictId],
    references: [subDistricts.subDistrictId],
  }),
  user: one(users, {
    fields: [petSitters.userId],
    references: [users.userId],
  }),
  petSitterImages: many(petSitterImages),
  petSittersPetTypes: many(petSittersPetTypes),
}));

export const usersRelations = relations(users, ({ many }) => ({
  petSitterReviews: many(petSitterReviews),
  petSitters: many(petSitters),
  pets: many(pets),
}));

export const petSitterImagesRelations = relations(
  petSitterImages,
  ({ one }) => ({
    petSitter: one(petSitters, {
      fields: [petSitterImages.petSitterId],
      references: [petSitters.petSitterId],
    }),
  }),
);

export const petsRelations = relations(pets, ({ one }) => ({
  petType: one(petTypes, {
    fields: [pets.petTypeId],
    references: [petTypes.petTypeId],
  }),
  user: one(users, {
    fields: [pets.userId],
    references: [users.userId],
  }),
}));

export const petTypesRelations = relations(petTypes, ({ many }) => ({
  pets: many(pets),
  petSittersPetTypes: many(petSittersPetTypes),
}));

export const petSittersPetTypesRelations = relations(
  petSittersPetTypes,
  ({ one }) => ({
    petSitter: one(petSitters, {
      fields: [petSittersPetTypes.petSitterId],
      references: [petSitters.petSitterId],
    }),
    petType: one(petTypes, {
      fields: [petSittersPetTypes.petTypeId],
      references: [petTypes.petTypeId],
    }),
  }),
);
