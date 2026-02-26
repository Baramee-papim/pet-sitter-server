import { Request, Response } from "express";
import AppError from "../errors/AppError";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import { UpdateUserBody } from "../types/user";

const UserController = {
  // TODO image
  updateUser: async (req: Request<{}, {}, UpdateUserBody>, res: Response) => {
    const { name, phone, idNumber, dateOfBirth, email, password } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    try {
      const result = await AuthService.getUser(token);

      await UserService.updateUser(
        result.data.user.id,
        name,
        phone,
        idNumber,
        dateOfBirth,
        result.data.user.email!,
        email,
        password,
      );
    } catch (error) {
      // Client error from service
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      return res.status(500).json({ error: "Internal server error" });
    }

    res.status(200).json({ message: "Updated successfully" });
  },
};

export default UserController;
