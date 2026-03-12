import { format } from "date-fns";
import { UTCDate } from "@date-fns/utc";
import AppError from "../errors/AppError";
import PetRepository from "../repositories/pet.repository";
import SitterRepository from "../repositories/sitter.repository";
import supabaseAdmin from "../supabase/admin";
import { SitterStatus } from "../types/sitter";
import { UserStatus } from "../types/user";
import mergeItemsByOrder from "../utils/mergeItemsByOrder";

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
    status: SitterStatus | Extract<UserStatus, "Banned"> | null,
    canFilterByName: boolean = false,
    canFilterByEmail: boolean = false,
  ) => {
    const { result, totalPetSitters } = await SitterRepository.get(
      seed,
      page,
      limit,
      keyword,
      petType,
      rating,
      experience,
      status,
      canFilterByName,
      canFilterByEmail,
    );

    return {
      totalPetSitters,
      totalPages: Math.ceil(totalPetSitters / limit),
      petSitters: result.map((petSitter) => ({
        ...petSitter,
        sitter: {
          name: petSitter.user.name,
          profileImgUrl: petSitter.user.profileImgUrl,
          email: petSitter.user.email,
          status: petSitter.user.status,
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

  getSitterById: async (sitterId: number, onlyApproved: boolean = true) => {
    const result = await SitterRepository.getById(sitterId, onlyApproved);

    if (!result) {
      throw new AppError(404, "Sitter not found");
    }

    return {
      ...result,
      sitter: {
        name: result.user.name,
        phone: result.user.phone,
        profileImgUrl: result.user.profileImgUrl,
        idNumber: result.user.idNumber,
        dateOfBirth: result.user.dateOfBirth,
        email: result.user.email,
        status: result.user.status,
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

  getSitterByUserId: async (userId: string) => {
    const result = await SitterRepository.getByUserId(userId);

    if (!result) {
      throw new AppError(404, "Sitter not found for this user");
    }

    return {
      ...result,
      sitter: {
        name: result.user.name,
        phone: result.user.phone,
        profileImgUrl: result.user.profileImgUrl,
        idNumber: result.user.idNumber,
        dateOfBirth: result.user.dateOfBirth,
        email: result.user.email,
        status: result.user.status,
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

  pendingUpdateSitter: async (
    userId: string,
    experience: string | null | undefined,
    tradeName: string | null | undefined,
    petTypeIds: number[] | null | undefined,
    introduction: string | null | undefined,
    services: string | null | undefined,
    description: string | null | undefined,
    address: string | null | undefined,
    latitude: string | null | undefined,
    longitude: string | null | undefined,
    provinceId: number | null | undefined,
    districtId: number | null | undefined,
    subDistrictId: number | null | undefined,
    files: Express.Multer.File[] | undefined,
    existingImages: { url: string; order: number }[] | undefined,
  ) => {
    if ((files?.length ?? 0) + (existingImages?.length ?? 0) > 10) {
      throw new AppError(400, "Maximum number of images is 10");
    }

    const sitter = await SitterRepository.getByUserId(userId);

    if (!sitter) {
      throw new AppError(404, "Sitter not found for this user");
    }

    const sitterId = sitter.petSitterId;

    const lookupPending = await SitterRepository.getPendingUpdateById(sitterId);

    if (lookupPending) {
      throw new AppError(400, "Sitter is already pending update");
    }

    if (petTypeIds) {
      const lookupPetTypeIds = (await PetRepository.getTypes()).map(
        (petType) => petType.petTypeId,
      );

      petTypeIds.forEach((petTypeId) => {
        if (!lookupPetTypeIds.includes(petTypeId)) {
          throw new AppError(404, "Pet type not found");
        }
      });
    }

    const lookupSitter = {
      tradeName: tradeName
        ? await SitterRepository.getByTradeName(tradeName)
        : null,
      pendingTradeName: tradeName
        ? await SitterRepository.getByPendingTradeName(tradeName)
        : null,
    };

    if (
      (lookupSitter.tradeName &&
        lookupSitter.tradeName.petSitterId !== sitterId) ||
      lookupSitter.pendingTradeName
    ) {
      throw new AppError(400, "Sitter with this trade name already exists");
    }

    const filePaths: string[] = [];
    const publicUrls: string[] = [];

    try {
      let finalUrls: string[] | undefined = undefined;

      if (files || existingImages) {
        if (files) {
          const now = new UTCDate();

          // Upload new images with upsert: true to overwrite if same path
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
                upsert: true,
              });

            if (error) throw error;

            filePaths.push(filePath);

            const { data } = supabaseAdmin.storage
              .from(bucket)
              .getPublicUrl(filePath);
            publicUrls.push(data.publicUrl);
          }
        }

        // Merge kept images and new uploads by order
        finalUrls = mergeItemsByOrder(
          existingImages ?? [],
          publicUrls.map((url) => ({ url: url })),
        ).map((url) => url.url);
      }

      await SitterRepository.pendingUpdate(
        sitterId,
        experience !== undefined ? experience : sitter.experience,
        tradeName !== undefined ? tradeName : sitter.tradeName,
        petTypeIds !== undefined
          ? petTypeIds
          : sitter.petSittersPetTypes.map(
              (petSitterPetType) => petSitterPetType.petType.petTypeId,
            ),
        introduction !== undefined ? introduction : sitter.introduction,
        services !== undefined ? services : sitter.services,
        description !== undefined ? description : sitter.description,
        address !== undefined ? address : sitter.address,
        latitude !== undefined ? latitude : sitter.latitude,
        longitude !== undefined ? longitude : sitter.longitude,
        provinceId !== undefined
          ? provinceId
          : sitter.province?.provinceId ?? null,
        districtId !== undefined
          ? districtId
          : sitter.district?.districtId ?? null,
        subDistrictId !== undefined
          ? subDistrictId
          : sitter.subDistrict?.subDistrictId ?? null,
        finalUrls !== undefined
          ? finalUrls
          : sitter.petSitterImages.map((image) => image.imgUrl),
      );

      if (sitter.status === "Unapproved") {
        await SitterRepository.update(
          sitterId,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          "Waiting for approval",
          undefined,
        );
      }
    } catch (error) {
      // Rollback newly uploaded files on any error
      if (filePaths.length) {
        await supabaseAdmin.storage.from(bucket).remove(filePaths);
      }

      throw error;
    }
  },

  approveUpdateSitter: async (sitterId: number) => {
    const lookupPendingSitter = await SitterRepository.getPendingUpdateById(
      sitterId,
    );

    if (!lookupPendingSitter) {
      throw new AppError(404, "Sitter not found for this pending update");
    }

    const lookupSitter = await SitterRepository.getById(sitterId, false);

    if (!lookupSitter) {
      throw new AppError(404, "Sitter not found");
    }

    const sitterPendingImages =
      lookupPendingSitter.petSitterImagePendingUpdates.map(
        (image) => image.imgUrl,
      );

    const removedImages = lookupSitter.petSitterImages
      .filter((image) => !sitterPendingImages.includes(image.imgUrl))
      .map((image) => image.imgUrl.split(`/${bucket}/`)[1]);

    if (removedImages.length) {
      await supabaseAdmin.storage.from(bucket).remove(removedImages);
    }

    await SitterRepository.update(
      sitterId,
      lookupPendingSitter.experience,
      lookupPendingSitter.tradeName,
      lookupPendingSitter.petSittersPetTypesPendingUpdates.map(
        (petSitterPetType) => petSitterPetType.petType.petTypeId,
      ),
      lookupPendingSitter.introduction,
      lookupPendingSitter.services,
      lookupPendingSitter.description,
      lookupPendingSitter.address,
      lookupPendingSitter.latitude,
      lookupPendingSitter.longitude,
      lookupPendingSitter.province?.provinceId,
      lookupPendingSitter.district?.districtId,
      lookupPendingSitter.subDistrict?.subDistrictId,
      "Approved",
      sitterPendingImages,
    );

    await SitterRepository.deletePendingUpdate(sitterId);
  },

  rejectUpdateSitter: async (sitterId: number) => {
    const lookupPendingSitter = await SitterRepository.getPendingUpdateById(
      sitterId,
    );

    if (!lookupPendingSitter) {
      throw new AppError(404, "Sitter not found for this pending update");
    }

    const lookupSitter = await SitterRepository.getById(sitterId, false);

    if (!lookupSitter) {
      throw new AppError(404, "Sitter not found");
    }

    const sitterImages = lookupSitter.petSitterImages.map(
      (image) => image.imgUrl,
    );

    const removedImages = lookupPendingSitter.petSitterImagePendingUpdates
      .filter((pendingImage) => !sitterImages.includes(pendingImage.imgUrl))
      .map((image) => image.imgUrl.split(`/${bucket}/`)[1]);

    if (removedImages.length) {
      await supabaseAdmin.storage.from(bucket).remove(removedImages);
    }

    if (lookupSitter.status !== "Approved") {
      await SitterRepository.update(
        sitterId,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        "Rejected",
        undefined,
      );
    }

    await SitterRepository.deletePendingUpdate(sitterId);
  },
};

export default SitterService;

// const filePaths: string[] = [];
// const publicUrls: string[] = [];

// try {
//   const now = new UTCDate();

//   // Upload new images with upsert: true to overwrite if same path
//   for (let i = 0; i < files.length; i++) {
//     const file = files[i];
//     const ext = file.mimetype.split("/")[1];

//     const filePath = `${userId}/sitter-${format(
//       now,
//       "yyyyMMddHHmmss",
//     )}-${i}.${ext}`;

//     const { error } = await supabaseAdmin.storage
//       .from(bucket)
//       .upload(filePath, file.buffer, {
//         contentType: file.mimetype,
//         upsert: true,
//       });

//     if (error) throw error;

//     filePaths.push(filePath);

//     const { data } = supabaseAdmin.storage
//       .from(bucket)
//       .getPublicUrl(filePath);
//     publicUrls.push(data.publicUrl);
//   }

//   // sort kept images by order, extract URLs
//   const safeExistingImages = Array.isArray(existingImages)
//     ? existingImages
//     : [];
//   const keptImages = safeExistingImages
//     .sort((a, b) => a.order - b.order)
//     .map((img) => img.url);

//   // kept existing first, new uploads appended at end
//   const finalImages = [...keptImages, ...publicUrls];

//   //  fallback: if nothing sent, keep all old images
//   const imagesToSave =
//     finalImages.length > 0
//       ? finalImages
//       : sitter?.petSitterImages.map((img) => img.imgUrl) ?? [];

//   await SitterRepository.update(
//     sitterId,
//     experience,
//     tradeName,
//     imagesToSave,
//     petTypeIds,
//     introduction,
//     services,
//     description,
//     address,
//     latitude,
//     longitude,
//     provinceId,
//     districtId,
//     subDistrictId,
//     sitter.status === "Approved" ? "Approved" : "Waiting for approval",
//   );

//   // delete only storage files that were removed by user
//   if (sitter?.petSitterImages.length) {
//     const keptUrls = new Set(keptImages);
//     const urlsToDelete = sitter.petSitterImages
//       .map((img) => img.imgUrl)
//       .filter((url) => !keptUrls.has(url));

//     if (urlsToDelete.length) {
//       const storagePaths = urlsToDelete
//         .map((url) => {
//           // correctly extract storage path from full public URL
//           const match = url.match(/\/object\/public\/sitter-assets\/(.+)/);
//           return match ? match[1] : null;
//         })
//         .filter((path): path is string => path !== null);

//       if (storagePaths.length) {
//         await supabaseAdmin.storage.from(bucket).remove(storagePaths);
//       }
//     }
//   }
// } catch (error) {
//   // rollback newly uploaded files on any error
//   if (filePaths.length) {
//     await supabaseAdmin.storage.from(bucket).remove(filePaths);
//   }
//   throw error;
// }
