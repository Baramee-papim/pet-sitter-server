import { NextFunction, Request, Response } from "express";
import { AdminGetOwnersQuery, AdminGetSittersQuery } from "../types/admin";
import { SITTER_STATUS } from "../types/sitter";
import { USER_STATUS } from "../types/user";

const AdminMiddleware = {
  getOwnersQuery: (
    req: Request<{}, {}, {}, AdminGetOwnersQuery>,
    res: Response,
    next: NextFunction,
  ) => {
    const { status } = req.query;

    if (status !== undefined && !USER_STATUS.includes(status)) {
      return res.status(400).json({ error: "Invalid user status" });
    }

    next();
  },

  getSittersQuery: (
    req: Request<{}, {}, {}, AdminGetSittersQuery>,
    res: Response,
    next: NextFunction,
  ) => {
    const { status } = req.query;

    if (
      status !== undefined &&
      !(status === "Banned" || SITTER_STATUS.includes(status))
    ) {
      return res.status(400).json({ error: "Invalid sitter status" });
    }

    next();
  },
};

export default AdminMiddleware;
