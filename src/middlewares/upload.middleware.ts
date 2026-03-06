import { NextFunction, Request, Response } from "express";
import multer from "multer";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const storage = multer.memoryStorage();

const UploadMiddleware = {
  requireFile: (fieldName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.file) {
        return res.status(400).json({
          message: `${fieldName.slice(0, 1).toUpperCase()}${fieldName.slice(
            1,
          )} is required`,
        });
      }
      next();
    };
  },

  image: multer({
    storage,
    limits: { fieldSize: MAX_SIZE, files: 1 },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];

      if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error("Only .png .jpg .jpeg allowed") as any;
        error.status = 400;
        cb(error);
      } else {
        cb(null, true);
      }
    },
  }),

  images: multer({
    storage,
    limits: { fileSize: MAX_SIZE, files: 10 },
    fileFilter: (req: Request, file: Express.Multer.File, cb) => {
      const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];

      if (!allowedTypes.includes(file.mimetype)) {
        cb(new Error("Only .png .jpg .jpeg allowed"));
      } else {
        cb(null, true);
      }
    },
  }),

  uploadImages: (req: Request, res: Response, next: NextFunction) => {
    UploadMiddleware.images.array("images", 10)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      }
      if (err) {
        return res
          .status(400)
          .json({ error: err.message ?? "File upload error" });
      }
      next();
    });
  },
};

export default UploadMiddleware;
