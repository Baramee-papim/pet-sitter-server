import { Request, Response } from "express";
import AppError from "../errors/AppError";
import SitterService from "../services/sitter.service";
import { GetSitterQuery, SitterIdParams } from "../types/sitter";

const SitterController = {
  // TODO comment and rating
  getSitters: async (
    req: Request<{}, {}, {}, GetSitterQuery>,
    res: Response,
  ) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const keyword = req.query.keyword ? req.query.keyword.trim() : null;
    const petType = req.query.pet_type ? req.query.pet_type.split(",") : null;
    const rating = Number(req.query.rating) || null;
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
        page,
        limit,
        keyword,
        petType,
        rating,
        experience,
      );
    } catch {
      return res.status(500).json({
        error:
          "Server could not read the sitters because of database connection",
      });
    }

    const sittersResponse = {
      totalPetSitters: result.totalPetSitters,
      totalPages: result.totalPages,
      currentPage: page,
      limit: limit,
      sitters: result.petSitters.map((petSitter) => ({
        id: petSitter.petSitterId,
        sitter: petSitter.sitter,
        imgUrl: petSitter.petSitterImage,
        tradeName: petSitter.tradeName,
        petTypes: petSitter.petTypes,
        latitude: petSitter.latitude,
        longitude: petSitter.longitude,
        province: petSitter.province,
        district: petSitter.district,
      })),
    };

    return res.status(200).json(sittersResponse);
  },

  // TODO comment and rating
  getSitterById: async (req: Request<SitterIdParams>, res: Response) => {
    const sitterId = Number(req.params.sitterId);
    let result;

    try {
      result = await SitterService.getSitterById(sitterId);
    } catch (error) {
      // Client error from service
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      return res.status(500).json({
        error:
          "Server could not read the sitter because of database connection",
      });
    }

    const sitterResponse = {
      id: result.petSitterId,
      sitter: result.sitter,
      imgUrls: result.petSitterImages,
      experience: result.experience,
      tradeName: result.tradeName,
      petTypes: result.petTypes,
      introduction: result.introduction,
      services: result.services,
      description: result.description,
      address: result.address,
      latitude: result.latitude,
      longitude: result.longitude,
      province: result.province,
      district: result.district,
      subDistrict: result.subDistrict,
      postCode: result.postCode,
    };

    return res.status(200).json(sitterResponse);
  },
};

export default SitterController;
