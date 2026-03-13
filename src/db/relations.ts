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
  petSitterPendingUpdates,
  petTypes,
  pets,
  bookingsPets,
  petSittersPetTypes,
  petSittersPetTypesPendingUpdates,
  petSitterImagePendingUpdates,
  petSitterImages,
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
  bookingsPets: many(bookingsPets),
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
  petSitterPendingUpdates: many(petSitterPendingUpdates),
  petSittersPetTypes: many(petSittersPetTypes),
  petSitterImages: many(petSitterImages),
}));

export const districtsRelations = relations(districts, ({ one, many }) => ({
  province: one(provinces, {
    fields: [districts.provinceId],
    references: [provinces.provinceId],
  }),
  subDistricts: many(subDistricts),
  petSitters: many(petSitters),
  petSitterPendingUpdates: many(petSitterPendingUpdates),
}));

export const provincesRelations = relations(provinces, ({ many }) => ({
  districts: many(districts),
  petSitters: many(petSitters),
  petSitterPendingUpdates: many(petSitterPendingUpdates),
}));

export const subDistrictsRelations = relations(
  subDistricts,
  ({ one, many }) => ({
    district: one(districts, {
      fields: [subDistricts.districtId],
      references: [districts.districtId],
    }),
    petSitters: many(petSitters),
    petSitterPendingUpdates: many(petSitterPendingUpdates),
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

export const petSitterPendingUpdatesRelations = relations(
  petSitterPendingUpdates,
  ({ one, many }) => ({
    district: one(districts, {
      fields: [petSitterPendingUpdates.districtId],
      references: [districts.districtId],
    }),
    petSitter: one(petSitters, {
      fields: [petSitterPendingUpdates.petSitterId],
      references: [petSitters.petSitterId],
    }),
    province: one(provinces, {
      fields: [petSitterPendingUpdates.provinceId],
      references: [provinces.provinceId],
    }),
    subDistrict: one(subDistricts, {
      fields: [petSitterPendingUpdates.subDistrictId],
      references: [subDistricts.subDistrictId],
    }),
    petSittersPetTypesPendingUpdates: many(petSittersPetTypesPendingUpdates),
    petSitterImagePendingUpdates: many(petSitterImagePendingUpdates),
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
  bookingsPets: many(bookingsPets),
}));

export const petTypesRelations = relations(petTypes, ({ many }) => ({
  pets: many(pets),
  bookingsPets: many(bookingsPets),
  petSittersPetTypes: many(petSittersPetTypes),
  petSittersPetTypesPendingUpdates: many(petSittersPetTypesPendingUpdates),
}));

export const bookingsPetsRelations = relations(bookingsPets, ({ one }) => ({
  booking: one(bookings, {
    fields: [bookingsPets.bookingId],
    references: [bookings.bookingId],
  }),
  pet: one(pets, {
    fields: [bookingsPets.petId],
    references: [pets.petId],
  }),
  petType: one(petTypes, {
    fields: [bookingsPets.petTypeId],
    references: [petTypes.petTypeId],
  }),
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

export const petSittersPetTypesPendingUpdatesRelations = relations(
  petSittersPetTypesPendingUpdates,
  ({ one }) => ({
    petSitterPendingUpdate: one(petSitterPendingUpdates, {
      fields: [petSittersPetTypesPendingUpdates.petSitterId],
      references: [petSitterPendingUpdates.petSitterId],
    }),
    petType: one(petTypes, {
      fields: [petSittersPetTypesPendingUpdates.petTypeId],
      references: [petTypes.petTypeId],
    }),
  }),
);

export const petSitterImagePendingUpdatesRelations = relations(
  petSitterImagePendingUpdates,
  ({ one }) => ({
    petSitterPendingUpdate: one(petSitterPendingUpdates, {
      fields: [petSitterImagePendingUpdates.petSitterId],
      references: [petSitterPendingUpdates.petSitterId],
    }),
  }),
);

export const petSitterImagesRelations = relations(
  petSitterImages,
  ({ one }) => ({
    petSitter: one(petSitters, {
      fields: [petSitterImages.petSitterId],
      references: [petSitters.petSitterId],
    }),
  }),
);
