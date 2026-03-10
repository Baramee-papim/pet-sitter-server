import { NextFunction, Request, Response } from "express";
import {
  GetSittersQuery,
  SitterIdParams,
  UpdateSitterBody,
} from "../types/sitter";
import { experienceRegex, petTypeRegex } from "../utils/regex";

const SitterMiddleware = {
  sitterId: (
    req: Request<SitterIdParams>,
    res: Response,
    next: NextFunction,
  ) => {
    const sitterId = req.params.sitterId;
    const parsedSitterId = Number(sitterId);

    if (!Number.isInteger(parsedSitterId) || parsedSitterId <= 0) {
      return res.status(400).json({
        error: "Sitter ID must be a positive integer",
      });
    }

    next();
  },

  getSittersQuery: (
    req: Request<{}, {}, {}, GetSittersQuery>,
    res: Response,
    next: NextFunction,
  ) => {
    const { page, limit, pet_type, rating, experience } = req.query;
    const parsedPage = Number(page);
    const parsedlimit = Number(limit);
    const parsedRating = Number(rating);

    if (
      !(
        (page === undefined ||
          (Number.isInteger(parsedPage) && parsedPage > 0)) &&
        (limit === undefined ||
          (Number.isInteger(parsedlimit) && parsedlimit > 0))
      )
    ) {
      return res.status(400).json({
        error: "Page and limit must be positive integers",
      });
    }

    if (parsedlimit > 20) {
      return res.status(400).json({
        error: "Limit must be less than or equal to 20",
      });
    }

    if (pet_type !== undefined && !petTypeRegex.test(pet_type)) {
      return res.status(400).json({
        error: "Pet type must be a comma separated list of pet types",
      });
    }

    if (
      !(
        rating === undefined ||
        (Number.isInteger(parsedRating) &&
          parsedRating >= 1 &&
          parsedRating <= 5)
      )
    ) {
      return res.status(400).json({
        error: "Rating must be an integer between 1 and 5",
      });
    }

    if (experience !== undefined && !experienceRegex.test(experience)) {
      return res.status(400).json({
        error: "Experience must be a range of integers",
      });
    }

    next();
  },

  updateSitterBody: (
    req: Request<{}, {}, { body: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.body?.body) {
      return res.status(400).json({ error: "Body is required" });
    }

    let body: UpdateSitterBody;

    try {
      body = JSON.parse(req.body.body);
    } catch {
      return res.status(400).json({ error: "Invalid JSON body" });
    }

    const {
      experience,
      tradeName,
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
    } = body;

    if (
      !(
        experience !== undefined ||
        tradeName !== undefined ||
        petTypeIds !== undefined ||
        introduction !== undefined ||
        services !== undefined ||
        description !== undefined ||
        address !== undefined ||
        latitude !== undefined ||
        longitude !== undefined ||
        provinceId !== undefined ||
        districtId !== undefined ||
        subDistrictId !== undefined
      )
    ) {
      return res.status(400).json({ error: "No fields to update" });
    }

    // Type validations
    if (experience !== undefined) {
      if (typeof experience !== "number") {
        return res.status(400).json({ error: "Experience must be a number" });
      }

      if (experience < 0) {
        return res.status(400).json({
          error: "Experience must be greater than 0",
        });
      }

      if (experience >= 100) {
        return res.status(400).json({
          error: "Experience must be less than 100",
        });
      }

      if (String(experience).split(".")[1]?.length > 1) {
        return res.status(400).json({
          error: "Experience must be a multiple of 0.1",
        });
      }
    }

    if (tradeName !== undefined) {
      if (typeof tradeName !== "string") {
        return res.status(400).json({ error: "Trade name must be a string" });
      }

      if (tradeName.length < 5) {
        return res.status(400).json({
          error: "Trade name must be at least 5 characters long",
        });
      }

      if (tradeName.length > 50) {
        return res.status(400).json({
          error: "Trade name must be less than 50 characters",
        });
      }
    }

    if (petTypeIds !== undefined) {
      if (!Array.isArray(petTypeIds)) {
        return res.status(400).json({
          error: "Pet type IDs must be an array",
        });
      }

      petTypeIds.forEach((petTypeId) => {
        if (typeof petTypeId !== "number") {
          return res.status(400).json({
            error: "Pet type IDs must be an array of numbers",
          });
        }
      });
    }

    if (address !== undefined) {
      if (typeof address !== "string") {
        return res.status(400).json({ error: "Address name must be a string" });
      }

      if (address.length < 10) {
        return res.status(400).json({
          error: "Address name must be at least 10 characters long",
        });
      }

      if (address.length > 100) {
        return res.status(400).json({
          error: "Address name must be less than 100 characters",
        });
      }
    }

    if (latitude !== undefined) {
      if (typeof latitude !== "number") {
        return res.status(400).json({ error: "Latitude must be a number" });
      }

      if (latitude < -90 || latitude > 90) {
        return res.status(400).json({
          error: "Latitude must be between -90 and 90",
        });
      }
    }

    if (longitude !== undefined) {
      if (typeof longitude !== "number") {
        return res.status(400).json({ error: "Longitude must be a number" });
      }

      if (longitude < -180 || longitude > 180) {
        return res.status(400).json({
          error: "Longitude must be between -180 and 180",
        });
      }
    }

    if (provinceId !== undefined) {
      if (typeof provinceId !== "number") {
        return res.status(400).json({ error: "Province ID must be a number" });
      }

      if (Number.isInteger(provinceId) && provinceId <= 0) {
        return res.status(400).json({
          error: "Province ID must be a positive integer",
        });
      }

      if (provinceId < 10 || provinceId > 96) {
        return res.status(400).json({
          error: "Province ID must be between 10 and 96",
        });
      }
    }

    if (districtId !== undefined) {
      if (typeof districtId !== "number") {
        return res.status(400).json({ error: "District ID must be a number" });
      }

      if (Number.isInteger(districtId) && districtId <= 0) {
        return res.status(400).json({
          error: "District ID must be a positive integer",
        });
      }

      if (districtId < 1001 || districtId > 9699) {
        return res.status(400).json({
          error: "District ID must be between 1001 and 9699",
        });
      }
    }

    if (subDistrictId !== undefined) {
      if (typeof subDistrictId !== "number") {
        return res.status(400).json({
          error: "Subdistrict ID must be a number",
        });
      }

      if (Number.isInteger(subDistrictId) && subDistrictId <= 0) {
        return res.status(400).json({
          error: "Subdistrict ID must be a positive integer",
        });
      }

      if (subDistrictId < 100101 || subDistrictId > 969999) {
        return res.status(400).json({
          error: "Subdistrict ID must be between 100101 and 969999",
        });
      }
    }

    if (introduction !== undefined && introduction !== null) {
      if (typeof introduction !== "string") {
        return res.status(400).json({ error: "Introduction must be a string" });
      }

      if (introduction.length < 10) {
        return res.status(400).json({
          error: "Introduction must be at least 10 characters long",
        });
      }
    }

    if (services !== undefined && services !== null) {
      if (typeof services !== "string") {
        return res.status(400).json({ error: "Services must be a string" });
      }

      if (services.length < 10) {
        return res.status(400).json({
          error: "Services must be at least 10 characters long",
        });
      }
    }

    if (description !== undefined && description !== null) {
      if (typeof description !== "string") {
        return res.status(400).json({ error: "Description must be a string" });
      }

      if (description.length < 10) {
        return res.status(400).json({
          error: "Description must be at least 10 characters long",
        });
      }
    }

    next();
  },
};

export default SitterMiddleware;
