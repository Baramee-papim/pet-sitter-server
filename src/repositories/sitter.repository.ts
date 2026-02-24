import {
  and,
  asc,
  count,
  countDistinct,
  eq,
  gte,
  ilike,
  inArray,
  lte,
  or,
} from "drizzle-orm";
import db from "../db/db";
import {
  petSitterImages,
  petSitters,
  petSittersPetTypes,
  petTypes,
} from "../db/schema";

const SitterRepository = {
  // TODO comment and rating
  get: async (
    page: number,
    limit: number,
    keyword: string | null,
    petType: string[] | null,
    experience: number[] | null,
  ) => {
    const offset = (page - 1) * limit;
    const filters = [];

    if (keyword) {
      const sitterIdsByPetTypeKeyword = await db
        .selectDistinct({ petSitterId: petSittersPetTypes.petSitterId })
        .from(petSittersPetTypes)
        .innerJoin(
          petTypes,
          eq(petTypes.petTypeId, petSittersPetTypes.petTypeId),
        )
        .where(ilike(petTypes.name, `%${keyword}%`));

      const sitterIdsFromPetTypes = sitterIdsByPetTypeKeyword.map(
        (row) => row.petSitterId,
      );

      if (sitterIdsFromPetTypes.length > 0) {
        filters.push(
          or(
            ilike(petSitters.tradeName, `%${keyword}%`),
            inArray(petSitters.petSitterId, sitterIdsFromPetTypes),
          ),
        );
      } else {
        filters.push(ilike(petSitters.tradeName, `%${keyword}%`));
      }
    }

    if (petType) {
      const sitterIdsWithAllPetTypes = await db
        .select({ petSitterId: petSittersPetTypes.petSitterId })
        .from(petSittersPetTypes)
        .innerJoin(
          petTypes,
          eq(petTypes.petTypeId, petSittersPetTypes.petTypeId),
        )
        .where(inArray(petTypes.name, petType))
        .groupBy(petSittersPetTypes.petSitterId)
        .having(eq(countDistinct(petTypes.name), petType.length));

      const sitterIds = sitterIdsWithAllPetTypes.map((row) => row.petSitterId);

      if (!sitterIds.length) {
        return { result: [], totalPetSitters: 0 };
      }

      filters.push(inArray(petSitters.petSitterId, sitterIds));
    }

    if (experience) {
      filters.push(gte(petSitters.experience, String(experience[0])));
      if (experience[1] !== Infinity) {
        filters.push(lte(petSitters.experience, String(experience[1])));
      }
    }

    const whereClause = filters.length ? and(...filters) : undefined;

    const result = await db.query.petSitters.findMany({
      with: {
        user: true,
        petSitterImages: true,
        province: true,
        district: true,
        petSittersPetTypes: {
          with: {
            petType: true,
          },
          orderBy: [asc(petTypes.petTypeId)],
        },
      },
      where: whereClause,
      limit,
      offset,
    });

    const countResult = await db
      .select({ total: count() })
      .from(petSitters)
      .where(whereClause);

    const totalPetSitters = countResult[0].total;

    return { result, totalPetSitters };
  },

  // TODO comment and rating
  getById: async (sitterId: number) => {
    return await db.query.petSitters.findFirst({
      with: {
        user: true,
        petSitterImages: {
          orderBy: [asc(petSitterImages.imgUrl)],
        },
        province: true,
        district: true,
        subDistrict: true,
        petSittersPetTypes: {
          with: { petType: true },
          orderBy: [asc(petTypes.petTypeId)],
        },
      },
      where: (sitter) => eq(sitter.petSitterId, sitterId),
    });
  },
};

export default SitterRepository;
