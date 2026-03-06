import { relations } from "drizzle-orm/relations";
import {
  users,
  bookings,
  petSitters,
  provinces,
  districts,
  subDistricts,
  banks,
  reviews,
  petSitterImages,
  petTypes,
  pets,
  petSittersPetTypes,
  bookingPets,
} from "./schema";

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  user: one(users, {
    fields: [bookings.petOwnerId],
    references: [users.userId],
  }),
  petSitter: one(petSitters, {
    fields: [bookings.petSitterId],
    references: [petSitters.petSitterId],
  }),
  reviews: many(reviews),
  bookingPets: many(bookingPets),
}));

export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
  petSitters: many(petSitters),
  pets: many(pets),
}));

export const petSittersRelations = relations(petSitters, ({ one, many }) => ({
  bookings: many(bookings),
  bank: one(banks, {
    fields: [petSitters.bankId],
    references: [banks.bankId],
  }),
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

export const banksRelations = relations(banks, ({ many }) => ({
  petSitters: many(petSitters),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.bookingId],
  }),
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

export const petsRelations = relations(pets, ({ one, many }) => ({
  petType: one(petTypes, {
    fields: [pets.petTypeId],
    references: [petTypes.petTypeId],
  }),
  user: one(users, {
    fields: [pets.userId],
    references: [users.userId],
  }),
  bookingPets: many(bookingPets),
}));

export const petTypesRelations = relations(petTypes, ({ many }) => ({
  pets: many(pets),
  petSittersPetTypes: many(petSittersPetTypes),
  bookingPets: many(bookingPets),
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

export const bookingPetsRelations = relations(bookingPets, ({ one }) => ({
  booking: one(bookings, {
    fields: [bookingPets.bookingId],
    references: [bookings.bookingId],
  }),
  pet: one(pets, {
    fields: [bookingPets.petId],
    references: [pets.petId],
  }),
  petType: one(petTypes, {
    fields: [bookingPets.petTypeId],
    references: [petTypes.petTypeId],
  }),
}));
