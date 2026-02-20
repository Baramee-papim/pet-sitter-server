import { NextFunction, Request, Response } from "express";
import { LoginBody, RegisterBody, ResetPasswordBody } from "../types/auth";
import { USER_ROLES } from "../types/user";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^0\d{9}$/;

const AuthMiddleware = {
  register: (
    req: Request<{}, {}, Partial<RegisterBody>>,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.body) {
      return res.status(400).json({ error: "Body is required" });
    }

    const { email, phone, password, role } = req.body;

    // Check for required fields
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!phone) {
      return res.status(400).json({ error: "Phone is required" });
    }

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    if (!role) {
      return res.status(400).json({ error: "Role is required" });
    }

    // Type validations
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    if (typeof password !== "string") {
      return res.status(400).json({ error: "Password must be a string" });
    }

    if (!USER_ROLES.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    next();
  },

  login: (
    req: Request<{}, {}, Partial<LoginBody>>,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.body) {
      return res.status(400).json({ error: "Body is required" });
    }

    const { email, password } = req.body;

    // Check for required fields
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    // Type validations
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    if (typeof password !== "string") {
      return res.status(400).json({ error: "Password must be a string" });
    }

    next();
  },

  resetPassword: (
    req: Request<{}, {}, Partial<ResetPasswordBody>>,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.body) {
      return res.status(400).json({ error: "Body is required" });
    }

    const { oldPassword, newPassword } = req.body;

    // Check for required fields
    if (!oldPassword) {
      return res.status(400).json({ error: "Old password is required" });
    }

    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }

    // Type validations
    if (typeof oldPassword !== "string") {
      return res.status(400).json({ error: "Old password must be a string" });
    }

    if (typeof newPassword !== "string") {
      return res.status(400).json({ error: "New password must be a string" });
    }

    next();
  },
};

export default AuthMiddleware;
