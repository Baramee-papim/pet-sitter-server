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
  sql,
} from "drizzle-orm";
import db from "../db/db";
import {
  petSitterImages,
  petSitters,
  petSittersPetTypes,
  petTypes,
} from "../db/schema";

const SitterRepository = {
  get: async (
    seed: string,
    page: number,
    limit: number,
    keyword: string | null,
    petType: string[] | null,
    rating: number | null,
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
      columns: {
        petSitterId: true,
        tradeName: true,
        latitude: true,
        longitude: true,
        ratingAvg: true,
      },
      with: {
        user: { columns: { name: true, profileImgUrl: true } },
        petSitterImages: { columns: { imgUrl: true } },
        petSitterReviews: { columns: { rating: true } },
        province: { columns: { name: true } },
        district: { columns: { name: true } },
        petSittersPetTypes: {
          columns: {},
          with: { petType: { columns: { name: true } } },
          orderBy: [asc(petTypes.petTypeId)],
        },
      },
      where: whereClause,
      orderBy: [
        ...(rating ? [sql`ABS(${petSitters.ratingBucket} - ${rating})`] : []),
        sql`md5(${petSitters.petSitterId}::text || ${seed})`,
      ],
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

  getById: async (sitterId: number) => {
    return await db.query.petSitters.findFirst({
      columns: {
        petSitterId: true,
        tradeName: true,
        experience: true,
        introduction: true,
        services: true,
        description: true,
        address: true,
        latitude: true,
        longitude: true,
        ratingAvg: true,
      },
      with: {
        user: { columns: { name: true, profileImgUrl: true } },
        petSitterImages: {
          columns: { imgUrl: true },
          orderBy: [asc(petSitterImages.imgUrl)],
        },
        petSitterReviews: { columns: { rating: true } },
        province: { columns: { name: true } },
        district: { columns: { name: true } },
        subDistrict: { columns: { name: true, postCode: true } },
        petSittersPetTypes: {
          columns: {},
          with: { petType: { columns: { name: true } } },
          orderBy: [asc(petTypes.petTypeId)],
        },
      },
      where: (sitter) => eq(sitter.petSitterId, sitterId),
    });
  },

  getByUserId: async (userId: string) => {
    return (
      await db.select().from(petSitters).where(eq(petSitters.userId, userId))
    )[0];
  },

  getByTradeName: async (tradeName: string) => {
    return (
      await db
        .select()
        .from(petSitters)
        .where(eq(petSitters.tradeName, tradeName))
    )[0];
  },

  update: async (
    sitterId: number,
    experience: number,
    tradeName: string,
    imgUrls: string[],
    petTypeIds: number[],
    introduction: string | null | undefined,
    services: string | null | undefined,
    description: string | null | undefined,
    address: string,
    latitude: number,
    longitude: number,
    provinceId: number,
    districtId: number,
    subDistrictId: number,
  ) => {
    await db.transaction(async (tx) => {
      await tx
        .update(petSitters)
        .set({
          experience: String(experience),
          tradeName,
          introduction,
          services,
          description,
          address,
          latitude: String(latitude),
          longitude: String(longitude),
          provinceId,
          districtId,
          subDistrictId,
        })
        .where(eq(petSitters.petSitterId, sitterId));

      await tx
        .delete(petSittersPetTypes)
        .where(eq(petSittersPetTypes.petSitterId, sitterId));

      await tx.insert(petSittersPetTypes).values(
        petTypeIds.map((petTypeId) => ({
          petSitterId: sitterId,
          petTypeId,
        })),
      );

      await tx
        .delete(petSitterImages)
        .where(eq(petSitterImages.petSitterId, sitterId));

      if (imgUrls.length) {
        await tx.insert(petSitterImages).values(
          imgUrls.map((imgUrl) => ({
            petSitterId: sitterId,
            imgUrl,
          })),
        );
      }
    });
  },
};

export default SitterRepository;
