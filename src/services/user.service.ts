import { format } from "date-fns";
import { UTCDate } from "@date-fns/utc";
import AppError from "../errors/AppError";
import UserRepository from "../repositories/user.repository";
import supabaseAdmin from "../supabase/admin";
import AuthService from "./auth.service";

const bucket = "user-assets";

const UserService = {
  updateUser: async (
    userId: string,
    name: string,
    phone: string,
    idNumber: string | null | undefined,
    dateOfBirth: string | null | undefined,
    oldEmail: string,
    newEmail: string | undefined,
    password: string | undefined,
    file: Express.Multer.File | undefined,
    removeProfileImg: boolean,
  ) => {
    const lookupUser = {
      byPhone: await UserRepository.getByPhone(phone),
      byIdNumber: idNumber
        ? await UserRepository.getByIdNumber(idNumber)
        : null,
    };

    if (lookupUser.byPhone && lookupUser.byPhone.userId !== userId) {
      throw new AppError(400, "User with this phone number already exists");
    }

    if (lookupUser.byIdNumber && lookupUser.byIdNumber.userId !== userId) {
      throw new AppError(400, "User with this ID number already exists");
    }

    if (newEmail && password) {
      await AuthService.changeEmail(oldEmail, newEmail, password);
    }

    let filePath: string | undefined;

    try {
      // Upload profile image
      let publicUrl: string | null | undefined;

      if (file) {
        const now = new UTCDate();
        const fileExt = file.mimetype.split("/")[1];
        filePath = `${userId}-${format(now, "yyyyMMddHHmmss")}.${fileExt}`;

        const { error } = await supabaseAdmin.storage
          .from(bucket)
          .upload(filePath, file.buffer, { contentType: file.mimetype });

        if (error) {
          throw error;
        }

        const { data } = supabaseAdmin.storage
          .from(bucket)
          .getPublicUrl(filePath);

        publicUrl = data.publicUrl;
      }

      const user = await UserRepository.getById(userId);

      await UserRepository.update(
        userId,
        name,
        phone,
        publicUrl,
        idNumber,
        dateOfBirth,
      );

      if (user.profileImgUrl && (publicUrl || removeProfileImg)) {
        await supabaseAdmin.storage
          .from(bucket)
          .remove([user.profileImgUrl.split(`/${bucket}/`)[1]]);
      }
    } catch (error) {
      // Rollback
      if (filePath) {
        await supabaseAdmin.storage.from(bucket).remove([filePath]);
      }

      throw error;
    }
  },
};

export default UserService;
