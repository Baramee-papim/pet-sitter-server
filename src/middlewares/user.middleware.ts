import { NextFunction, Request, Response } from "express";
import { UpdateUserBody } from "../types/user";
import {
  dateRegex,
  emailRegex,
  idNumberRegex,
  phoneRegex,
} from "../utils/regex";
import validateIdNumber from "../utils/validateIdNumber";

const UserMiddleware = {
  updateUserBody: (
    req: Request<{}, {}, Partial<UpdateUserBody>>,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.body) {
      return res.status(400).json({ error: "Body is required" });
    }

    const { name, email, phone, idNumber, dateOfBirth } = req.body;

    // Check for required fields
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!phone) {
      return res.status(400).json({ error: "Phone is required" });
    }

    // Type validations
    if (typeof name !== "string") {
      return res.status(400).json({ error: "Name must be a string" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    if (typeof phone !== "string") {
      return res.status(400).json({ error: "Phone must be a string" });
    }

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    if (typeof idNumber !== "string") {
      return res.status(400).json({ error: "ID number must be a string" });
    }

    if (
      typeof idNumber !== "undefined" &&
      !(idNumberRegex.test(idNumber) && validateIdNumber(idNumber))
    ) {
      return res.status(400).json({ error: "Invalid ID number" });
    }

    if (typeof dateOfBirth !== "undefined") {
      if (!dateRegex.test(dateOfBirth)) {
        return res.status(400).json({ error: "Invalid date of birth" });
      }

      const date = new Date(dateOfBirth);
      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({ error: "Invalid date of birth" });
      }
    }

    next();
  },
};

export default UserMiddleware;
