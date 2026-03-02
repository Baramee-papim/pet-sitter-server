import { format } from "date-fns";
import { UTCDate } from "@date-fns/utc";
import AppError from "../errors/AppError";
import PetRepository from "../repositories/pet.repository";
import SitterRepository from "../repositories/sitter.repository";
import supabaseAdmin from "../supabase/admin";

const bucket = "sitter-assets";

const SitterService = {
  getSitters: async (
    seed: string,
    page: number,
    limit: number,
    keyword: string | null,
    petType: string[] | null,
    rating: number | null,
    experience: number[] | null,
  ) => {
    const { result, totalPetSitters } = await SitterRepository.get(
      seed,
      page,
      limit,
      keyword,
      petType,
      rating,
      experience,
    );

    return {
      totalPetSitters,
      totalPages: Math.ceil(totalPetSitters / limit),
      petSitters: result.map((petSitter) => ({
        ...petSitter,
        sitter: {
          name: petSitter.user.name,
          profileImgUrl: petSitter.user.profileImgUrl,
        },
        petSitterImage: petSitter.petSitterImages[0]?.imgUrl ?? null,
        petTypes: petSitter.petSittersPetTypes.map(
          (petSitterPetType) => petSitterPetType.petType.name,
        ),
        province: petSitter.province?.name ?? null,
        district: petSitter.district?.name ?? null,
        latitude: petSitter.latitude ? Number(petSitter.latitude) : null,
        longitude: petSitter.longitude ? Number(petSitter.longitude) : null,
        ratingAvg: petSitter.ratingAvg ? Number(petSitter.ratingAvg) : null,
      })),
    };
  },

  getSitterById: async (sitterId: number) => {
    const result = await SitterRepository.getById(sitterId);

    if (!result) {
      throw new AppError(404, "Sitter not found");
    }

    return {
      ...result,
      sitter: {
        name: result.user.name,
        profileImgUrl: result.user.profileImgUrl,
      },
      petSitterImages: result.petSitterImages.map(
        (petSitterImage) => petSitterImage.imgUrl,
      ),
      petTypes: result.petSittersPetTypes.map(
        (petSitterPetType) => petSitterPetType.petType.name,
      ),
      province: result.province?.name ?? null,
      district: result.district?.name ?? null,
      subDistrict: result.subDistrict?.name ?? null,
      postCode: result.subDistrict?.postCode ?? null,
      experience: result.experience ? Number(result.experience) : null,
      latitude: result.latitude ? Number(result.latitude) : null,
      longitude: result.longitude ? Number(result.longitude) : null,
      ratingAvg: result.ratingAvg ? Number(result.ratingAvg) : null,
    };
  },

  updateSitter: async (
    userId: string,
    experience: number,
    tradeName: string,
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
    files: Express.Multer.File[],
  ) => {
    const lookupPetTypeIds = (await PetRepository.getTypes()).map(
      (petType) => petType.petTypeId,
    );

    petTypeIds.forEach((petTypeId) => {
      if (!lookupPetTypeIds.includes(petTypeId)) {
        throw new AppError(404, "Pet type not found");
      }
    });

    const sitterId = (await SitterRepository.getByUserId(userId)).petSitterId;

    const lookupSitter = {
      tradeName: await SitterRepository.getByTradeName(tradeName),
    };

    if (
      lookupSitter.tradeName &&
      lookupSitter.tradeName.petSitterId !== sitterId
    ) {
      throw new AppError(400, "Sitter with this trade name already exists");
    }

    const filePaths: string[] = [];

    try {
      const now = new UTCDate();
      const publicUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.mimetype.split("/")[1];
        const filePath = `${userId}/sitter-${format(
          now,
          "yyyyMMddHHmmss",
        )}-${i}.${ext}`;

        const { error } = await supabaseAdmin.storage
          .from(bucket)
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
          });

        if (error) {
          throw error;
        }

        filePaths.push(filePath);
      }

      filePaths.forEach((path) => {
        const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
        publicUrls.push(data.publicUrl);
      });

      const sitter = (await SitterRepository.getById(sitterId))!;

      await SitterRepository.update(
        sitterId,
        experience,
        tradeName,
        publicUrls,
        petTypeIds,
        introduction,
        services,
        description,
        address,
        latitude,
        longitude,
        provinceId,
        districtId,
        subDistrictId,
      );

      if (sitter.petSitterImages.length) {
        await supabaseAdmin.storage
          .from(bucket)
          .remove(
            sitter.petSitterImages.map(
              (image) => image.imgUrl.split(`/${bucket}/`)[1],
            ),
          );
      }
    } catch (error) {
      // Rollback
      if (filePaths.length) {
        await supabaseAdmin.storage.from(bucket).remove(filePaths);
      }

      throw error;
    }
  },
};

export default SitterService;
