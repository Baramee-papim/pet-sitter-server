import OwnerRepository from "../repositories/owner.repository";
import { UserStatus } from "../types/user";

const OwnerService = {
  getOwners: async (
    seed: string,
    page: number,
    limit: number,
    keyword: string | null,
    status: UserStatus | null,
  ) => {
    const { result, totalOwners } = await OwnerRepository.get(
      seed,
      page,
      limit,
      keyword,
      status,
    );

    return {
      totalOwners,
      totalPages: Math.ceil(totalOwners / limit),
      petOwners: result.map((petOwner) => ({
        ...petOwner,
        petCount: petOwner.pets.length,
      })),
    };
  },
};

export default OwnerService;
