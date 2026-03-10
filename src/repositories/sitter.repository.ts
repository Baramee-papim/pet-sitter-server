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
  users,
} from "../db/schema";
import { SitterStatus } from "../types/sitter";
import { UserStatus } from "../types/user";

const SitterRepository = {
  get: async (
    seed: string,
    page: number,
    limit: number,
    keyword: string | null,
    petType: string[] | null,
    rating: number | null,
    experience: number[] | null,
    status: SitterStatus | Extract<UserStatus, "Banned"> | null,
    canFilterByName: boolean = false,
    canFilterByEmail: boolean = false,
  ) => {
    const offset = (page - 1) * limit;
    const filters = [];

    if (keyword) {
      const keywordFilters = [ilike(petSitters.tradeName, `%${keyword}%`)];

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
        keywordFilters.push(
          inArray(petSitters.petSitterId, sitterIdsFromPetTypes),
        );
      }

      if (canFilterByName || canFilterByEmail) {
        const userKeywordConditions = [];
        if (canFilterByName) {
          userKeywordConditions.push(ilike(users.name, `%${keyword}%`));
        }
        if (canFilterByEmail) {
          userKeywordConditions.push(ilike(users.email, `%${keyword}%`));
        }
        const sitterIdsByUserKeyword = await db
          .selectDistinct({ petSitterId: petSitters.petSitterId })
          .from(petSitters)
          .innerJoin(users, eq(users.userId, petSitters.userId))
          .where(or(...userKeywordConditions));

        const ids = sitterIdsByUserKeyword.map((row) => row.petSitterId);

        if (ids.length > 0) {
          keywordFilters.push(inArray(petSitters.petSitterId, ids));
        }
      }

      filters.push(or(...keywordFilters));
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

    if (status) {
      if (status === "Banned") {
        const sitterIdsByBannedStatus = await db
          .selectDistinct({ petSitterId: petSitters.petSitterId })
          .from(petSitters)
          .innerJoin(users, eq(users.userId, petSitters.userId))
          .where(eq(users.status, "Banned"));

        const ids = sitterIdsByBannedStatus.map((row) => row.petSitterId);

        filters.push(inArray(petSitters.petSitterId, ids));
      } else {
        filters.push(eq(petSitters.status, status));
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
        status: true,
      },
      with: {
        user: {
          columns: {
            name: true,
            profileImgUrl: true,
            email: true,
            status: true,
          },
        },
        petSitterImages: { columns: { imgUrl: true } },
        province: { columns: { name: true } },
        district: { columns: { name: true } },
        petSittersPetTypes: {
          columns: {},
          with: {
            petType: { columns: { name: true } },
          },
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

  getById: async (sitterId: number, onlyApproved: boolean = true) => {
    const filters = [];

    if (onlyApproved) {
      filters.push(eq(petSitters.status, "Approved"));
    }

    const whereClause = and(eq(petSitters.petSitterId, sitterId), ...filters);

    return db.query.petSitters.findFirst({
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
        reviewCount: true,
        ratingAvg: true,
        status: true,
      },
      with: {
        user: {
          columns: {
            name: true,
            phone: true,
            profileImgUrl: true,
            idNumber: true,
            dateOfBirth: true,
            email: true,
            status: true,
          },
        },
        petSitterImages: {
          columns: { imgUrl: true },
          orderBy: [asc(petSitterImages.imageOrder)],
        },
        province: { columns: { name: true } },
        district: { columns: { name: true } },
        subDistrict: { columns: { name: true, postCode: true } },
        petSittersPetTypes: {
          columns: {},
          with: {
            petType: { columns: { name: true } },
          },
          orderBy: [asc(petTypes.petTypeId)],
        },
      },
      where: whereClause,
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
    experience: string | null | undefined,
    tradeName: string | null | undefined,
    imgUrls: string[],
    petTypeIds: number[] | undefined,
    introduction: string | null | undefined,
    services: string | null | undefined,
    description: string | null | undefined,
    address: string | null | undefined,
    latitude: string | null | undefined,
    longitude: string | null | undefined,
    provinceId: number | null | undefined,
    districtId: number | null | undefined,
    subDistrictId: number | null | undefined,
  ) => {
    await db.transaction(async (tx) => {
      await tx
        .update(petSitters)
        .set({
          experience,
          tradeName,
          introduction,
          services,
          description,
          address,
          latitude,
          longitude,
          provinceId,
          districtId,
          subDistrictId,
        })
        .where(eq(petSitters.petSitterId, sitterId));

      if (petTypeIds) {
        await tx
          .delete(petSittersPetTypes)
          .where(eq(petSittersPetTypes.petSitterId, sitterId));

        await tx.insert(petSittersPetTypes).values(
          petTypeIds.map((petTypeId) => ({
            petSitterId: sitterId,
            petTypeId,
          })),
        );
      }

      await tx
        .delete(petSitterImages)
        .where(eq(petSitterImages.petSitterId, sitterId));

      if (imgUrls.length) {
        await tx.insert(petSitterImages).values(
          imgUrls.map((imgUrl, index) => ({
            petSitterId: sitterId,
            imgUrl,
            imageOrder: index,
          })),
        );
      }
    });
  },
};

export default SitterRepository;
