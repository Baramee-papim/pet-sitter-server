import { format } from "date-fns";
import { Request, Response } from "express";
import OwnerService from "../services/owner.service";
import SitterService from "../services/sitter.service";
import { AdminGetOwnersQuery, AdminGetSittersQuery } from "../types/admin";

const AdminController = {
  getOwners: async (
    req: Request<{}, {}, {}, AdminGetOwnersQuery>,
    res: Response,
  ) => {
    const seed = req.query.seed || format(new Date(), "yyyyMMdd");
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const keyword = req.query.keyword ? req.query.keyword.trim() : null;
    const status = req.query.status || null;
    let result;

    try {
      result = await OwnerService.getOwners(seed, page, limit, keyword, status);
    } catch {
      return res.status(500).json({ error: "Internal server error" });
    }

    const ownersResponse = {
      totalOwners: result.totalOwners,
      totalPages: result.totalPages,
      currentPage: page,
      limit: limit,
      owners: result.petOwners.map((petOwner) => ({
        id: petOwner.userId,
        name: petOwner.name,
        phone: petOwner.phone,
        profileImgUrl: petOwner.profileImgUrl,
        email: petOwner.email,
        status: petOwner.status,
        petCount: petOwner.petCount,
      })),
    };

    return res.status(200).json(ownersResponse);
  },

  getSitters: async (
    req: Request<{}, {}, {}, AdminGetSittersQuery>,
    res: Response,
  ) => {
    const seed = req.query.seed || format(new Date(), "yyyyMMdd");
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const keyword = req.query.keyword ? req.query.keyword.trim() : null;
    const petType = req.query.pet_type ? req.query.pet_type.split(",") : null;
    const rating = Number(req.query.rating) || null;
    const status = req.query.status || null;
    let experience: number[] | null;
    let result;

    if (req.query.experience) {
      experience = req.query.experience.split("-").map(Number);
      if (req.query.experience.endsWith("-")) {
        experience[1] = Infinity;
      } else {
        experience.sort((a, b) => a - b);
      }
    } else {
      experience = null;
    }

    try {
      result = await SitterService.getSitters(
        seed,
        page,
        limit,
        keyword,
        petType,
        rating,
        experience,
        status,
        true,
        true,
      );
    } catch {
      return res.status(500).json({ error: "Internal server error" });
    }

    const sittersResponse = {
      totalSitters: result.totalPetSitters,
      totalPages: result.totalPages,
      currentPage: page,
      limit: limit,
      sitters: result.petSitters.map((petSitter) => ({
        id: petSitter.petSitterId,
        sitter: petSitter.sitter,
        tradeName: petSitter.tradeName,
        status: petSitter.status,
      })),
    };

    return res.status(200).json(sittersResponse);
  },
};

export default AdminController;
