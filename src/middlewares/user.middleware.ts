import { NextFunction, Request, Response } from "express";
import { UpdateUserBody } from "../types/user";
import {
  dateRegex,
  emailRegex,
  idNumberRegex,
  nameRegex,
  phoneRegex,
} from "../utils/regex";
import validateIdNumber from "../utils/validateIdNumber";

const UserMiddleware = {
  updateUserBody: (
    req: Request<{}, {}, { body: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.body?.body) {
      return res.status(400).json({ error: "Body is required" });
    }

    let body: UpdateUserBody;

    try {
      body = JSON.parse(req.body.body);
    } catch {
      return res.status(400).json({ error: "Invalid JSON body" });
    }

    const {
      name,
      phone,
      idNumber,
      dateOfBirth,
      email,
      password,
      removeProfileImg,
    } = body;

    // Check for required fields
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    if (!phone) {
      return res.status(400).json({ error: "Phone is required" });
    }

    // Type validations
    if (typeof name !== "string") {
      return res.status(400).json({ error: "Name must be a string" });
    }

    if (!nameRegex.test(name)) {
      return res.status(400).json({ error: "Invalid name" });
    }

    if (name.length < 2) {
      return res.status(400).json({
        error: "Name must be at least 2 characters long",
      });
    }

    if (name.length > 100) {
      return res.status(400).json({
        error: "Name must be less than 100 characters",
      });
    }

    if (typeof phone !== "string") {
      return res.status(400).json({ error: "Phone must be a string" });
    }

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    if (idNumber !== undefined && idNumber !== null && idNumber !== "") {
      if (typeof idNumber !== "string") {
        return res.status(400).json({ error: "ID number must be a string" });
      }

      if (!(idNumberRegex.test(idNumber) && validateIdNumber(idNumber))) {
        return res.status(400).json({ error: "Invalid ID number" });
      }
    }

    if (
      dateOfBirth !== undefined &&
      dateOfBirth !== null &&
      dateOfBirth !== ""
    ) {
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

    if (email !== undefined || password !== undefined) {
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      if (!password) {
        return res.status(400).json({ error: "Password is required" });
      }

      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email address" });
      }

      if (typeof password !== "string") {
        return res.status(400).json({ error: "Password must be a string" });
      }

      if (password.length < 12) {
        return res.status(400).json({
          error: "Password must be at least 12 characters long",
        });
      }
    }

    if (
      removeProfileImg !== undefined &&
      typeof removeProfileImg !== "boolean"
    ) {
      return res.status(400).json({
        error: "Remove profile image must be a boolean",
      });
    }

    next();
  },
};

export default UserMiddleware;
