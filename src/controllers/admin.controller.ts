import { format } from "date-fns";
import { Request, Response } from "express";
import OwnerService from "../services/owner.service";
import { AdminGetOwnersQuery } from "../types/admin";

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
};

export default AdminController;
