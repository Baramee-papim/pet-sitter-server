import { NextFunction, Request, Response } from "express";
import { PET_SEXES, PetBody } from "../types/owner";
import { dateRegex, nameRegex } from "../utils/regex";

const OwnerMiddleware = {
  // TODO image
  petBody: (
    req: Request<{}, {}, Partial<PetBody>>,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.body) {
      return res.status(400).json({ error: "Body is required" });
    }

    const {
      petName,
      petTypeId,
      sex,
      breed,
      dateOfBirth,
      color,
      weight,
      about,
    } = req.body;

    // Check for required fields
    if (!petName) {
      return res.status(400).json({ error: "Pet name is required" });
    }

    if (!petTypeId) {
      return res.status(400).json({ error: "Pet type ID is required" });
    }

    if (!sex) {
      return res.status(400).json({ error: "Sex is required" });
    }

    // Type validations
    if (typeof petName !== "string") {
      return res.status(400).json({ error: "Pet name must be a string" });
    }

    if (!nameRegex.test(petName)) {
      return res.status(400).json({ error: "Invalid pet name" });
    }

    if (petName.length < 2) {
      return res.status(400).json({
        error: "Pet name must be at least 2 characters long",
      });
    }

    if (petName.length > 50) {
      return res.status(400).json({
        error: "Pet name must be less than 50 characters long",
      });
    }

    if (typeof petTypeId !== "number") {
      return res.status(400).json({ error: "Pet type ID must be a number" });
    }

    if (!PET_SEXES.includes(sex)) {
      return res.status(400).json({ error: "Invalid sex" });
    }

    if (typeof breed !== "undefined" && breed !== null) {
      if (typeof breed !== "string") {
        return res.status(400).json({ error: "Breed must be a string" });
      }

      if (breed.length < 2) {
        return res.status(400).json({
          error: "Breed must be at least 2 characters long",
        });
      }

      if (breed.length > 100) {
        return res.status(400).json({
          error: "Breed must be less than 100 characters long",
        });
      }
    }

    if (typeof dateOfBirth !== "undefined" && dateOfBirth !== null) {
      if (!dateRegex.test(dateOfBirth)) {
        return res.status(400).json({ error: "Invalid date of birth" });
      }

      const date = new Date(dateOfBirth);
      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({ error: "Invalid date of birth" });
      }

      if (date > new Date()) {
        return res.status(400).json({
          error: "Date of birth must be in the past",
        });
      }
    }

    if (typeof color !== "undefined" && color !== null) {
      if (typeof color !== "string") {
        return res.status(400).json({ error: "Color must be a string" });
      }

      if (color.length < 2) {
        return res.status(400).json({
          error: "Color must be at least 2 characters long",
        });
      }

      if (color.length > 100) {
        return res.status(400).json({
          error: "Color must be less than 100 characters long",
        });
      }
    }

    if (typeof weight !== "undefined" && weight !== null) {
      if (typeof weight !== "number") {
        return res.status(400).json({ error: "Weight must be a number" });
      }

      if (weight < 0) {
        return res.status(400).json({ error: "Weight must be greater than 0" });
      }

      if (weight >= 1000) {
        return res.status(400).json({ error: "Weight must be less than 1000" });
      }

      if (String(weight).split(".")[1]?.length > 2) {
        return res.status(400).json({
          error: "Weight must be a multiple of 0.01",
        });
      }
    }

    if (typeof about !== "undefined" && about !== null) {
      if (typeof about !== "string") {
        return res.status(400).json({ error: "About must be a string" });
      }

      if (about.length < 5) {
        return res.status(400).json({
          error: "About must be at least 5 characters long",
        });
      }

      if (about.length > 500) {
        return res.status(400).json({
          error: "About must be less than 500 characters long",
        });
      }
    }

    next();
  },
};

export default OwnerMiddleware;
