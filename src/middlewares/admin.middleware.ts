import { NextFunction, Request, Response } from "express";
import { AdminGetOwnersQuery } from "../types/admin";
import { USER_STATUS } from "../types/user";

const AdminMiddleware = {
  getOwnersQuery: (
    req: Request<{}, {}, {}, AdminGetOwnersQuery>,
    res: Response,
    next: NextFunction,
  ) => {
    const { status } = req.query;

    if (typeof status !== "undefined" && !USER_STATUS.includes(status)) {
      return res.status(400).json({ error: "Invalid user status" });
    }

    next();
  },
};

export default AdminMiddleware;
