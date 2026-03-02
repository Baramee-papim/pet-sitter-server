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
        (typeof page === "undefined" ||
          (Number.isInteger(parsedPage) && parsedPage > 0)) &&
        (typeof limit === "undefined" ||
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

    if (typeof pet_type !== "undefined" && !petTypeRegex.test(pet_type)) {
      return res.status(400).json({
        error: "Pet type must be a comma separated list of pet types",
      });
    }

    if (
      !(
        typeof rating === "undefined" ||
        (Number.isInteger(parsedRating) &&
          parsedRating >= 1 &&
          parsedRating <= 5)
      )
    ) {
      return res.status(400).json({
        error: "Rating must be an integer between 1 and 5",
      });
    }

    if (
      typeof experience !== "undefined" &&
      !experienceRegex.test(experience)
    ) {
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

    // Check for required fields
    if (!experience) {
      return res.status(400).json({ error: "Experience is required" });
    }

    if (!tradeName) {
      return res.status(400).json({ error: "Trade name is required" });
    }

    if (!petTypeIds) {
      return res.status(400).json({ error: "Pet type IDs are required" });
    }

    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }

    if (!latitude) {
      return res.status(400).json({ error: "Latitude is required" });
    }

    if (!longitude) {
      return res.status(400).json({ error: "Longitude is required" });
    }

    if (!provinceId) {
      return res.status(400).json({ error: "Province ID is required" });
    }

    if (!districtId) {
      return res.status(400).json({ error: "District ID is required" });
    }

    if (!subDistrictId) {
      return res.status(400).json({ error: "Subdistrict ID is required" });
    }

    // Type validations
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

    if (typeof latitude !== "number") {
      return res.status(400).json({ error: "Latitude must be a number" });
    }

    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({
        error: "Latitude must be between -90 and 90",
      });
    }

    if (typeof longitude !== "number") {
      return res.status(400).json({ error: "Longitude must be a number" });
    }

    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({
        error: "Longitude must be between -180 and 180",
      });
    }

    if (typeof provinceId !== "number") {
      return res.status(400).json({ error: "Province ID must be a number" });
    }

    if (typeof districtId !== "number") {
      return res.status(400).json({ error: "District ID must be a number" });
    }

    if (typeof subDistrictId !== "number") {
      return res.status(400).json({ error: "Subdistrict ID must be a number" });
    }

    if (typeof introduction !== "undefined" && introduction !== null) {
      if (typeof introduction !== "string") {
        return res.status(400).json({ error: "Introduction must be a string" });
      }

      if (introduction.length < 10) {
        return res.status(400).json({
          error: "Introduction must be at least 10 characters long",
        });
      }
    }

    if (typeof services !== "undefined" && services !== null) {
      if (typeof services !== "string") {
        return res.status(400).json({ error: "Services must be a string" });
      }

      if (services.length < 10) {
        return res.status(400).json({
          error: "Services must be at least 10 characters long",
        });
      }
    }

    if (typeof description !== "undefined" && description !== null) {
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
