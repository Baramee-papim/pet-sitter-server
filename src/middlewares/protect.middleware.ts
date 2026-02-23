import { NextFunction, Request, Response } from "express";
import UserRepository from "../repositories/user.repository";
import supabase from "../supabase/client";
import { UserRole } from "../types/user";

function protect(role: UserRole, message: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    try {
      const { data, error: authError } = await supabase.auth.getUser(token);

      if (authError || !data.user) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }

      const result = (await UserRepository.getById(data.user.id))[0];

      if (!result) {
        return res.status(404).json({ error: "User not found" });
      }

      req.user = { ...data.user, role: result.role };

      if (req.user.role !== role) {
        return res.status(403).json({ error: message });
      }
    } catch {
      return res.status(500).json({ error: "Internal server error" });
    }

    next();
  };
}

const ProtectMiddleware = {
  owner: protect("owner", "Forbidden: You do not have pet owner access"),

  petSitter: protect("sitter", "Forbidden: You do not have pet sitter access"),

  admin: protect("admin", "Forbidden: You do not have admin access"),
};

export default ProtectMiddleware;
