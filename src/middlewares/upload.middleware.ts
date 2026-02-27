import multer from "multer";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const storage = multer.memoryStorage();

const UploadMiddleware = {
  image: multer({
    storage,
    limits: { fieldSize: MAX_SIZE },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];

      if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error("Only .png .jpg .jpeg allowed") as any;
        error.status = 400; // บอกให้ handler ส่ง 400
        cb(error);
      } else {
        cb(null, true);
      }
    },
  }),
};

export default UploadMiddleware;
