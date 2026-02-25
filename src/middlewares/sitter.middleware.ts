import { NextFunction, Request, Response } from "express";
import {
  GetSittersBody,
  GetSittersQuery,
  SitterIdParams,
} from "../types/sitter";
import { experienceRegex, petTypeRegex } from "../utils/regex";

const SitterMiddleware = {
  sitterId: (
    req: Request<SitterIdParams>,
    res: Response,
    next: NextFunction,
  ) => {
    const { sitterId } = req.params;
    const parsedSitterId = Number(sitterId);

    if (!Number.isInteger(parsedSitterId) || parsedSitterId <= 0) {
      return res.status(400).json({
        error: "Sitter ID must be a positive integer",
      });
    }

    next();
  },

  getSittersQuery: (
    req: Request<{}, {}, Partial<GetSittersBody>, GetSittersQuery>,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.body) {
      return res.status(400).json({ error: "Body is required" });
    }

    const { seed } = req.body;

    if (!seed) {
      return res.status(400).json({ error: "Seed is required" });
    }

    if (typeof seed !== "string") {
      return res.status(400).json({ error: "Seed must be a string" });
    }

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
};

export default SitterMiddleware;
