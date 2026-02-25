import AppError from "../errors/AppError";
import SitterRepository from "../repositories/sitter.repository";

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
};

export default SitterService;
