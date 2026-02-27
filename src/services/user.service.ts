import { format } from "date-fns";
import { UTCDate } from "@date-fns/utc";
import AppError from "../errors/AppError";
import UserRepository from "../repositories/user.repository";
import supabaseAdmin from "../supabase/admin";
import AuthService from "./auth.service";

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
      user: (await UserRepository.getById(userId))[0],
      phone: (await UserRepository.getByPhone(phone))[0],
      idNumber: idNumber
        ? (await UserRepository.getByIdNumber(idNumber))[0]
        : null,
    };

    if (lookupUser.phone && lookupUser.phone.userId !== userId) {
      throw new AppError(400, "User with this phone number already exists");
    }

    if (lookupUser.idNumber && lookupUser.idNumber.userId !== userId) {
      throw new AppError(400, "User with this ID number already exists");
    }

    if (newEmail && password) {
      await AuthService.changeEmail(oldEmail, newEmail, password);
    }

    let newImgUrl: string | null | undefined = undefined;

    // Only remove profile image
    if (removeProfileImg && lookupUser.user.profileImgUrl) {
      const oldPath = lookupUser.user.profileImgUrl.split("/user-assets/")[1];

      await supabaseAdmin.storage.from("user-assets").remove([oldPath]);

      newImgUrl = null;
    }

    // Upload new profile image
    if (file) {
      const now = new UTCDate();
      const fileExt = file.mimetype.split("/")[1];
      const fileName = `${userId}-${format(now, "yyyyMMddHHmmss")}.${fileExt}`;

      await supabaseAdmin.storage
        .from("user-assets")
        .upload(fileName, file.buffer, { contentType: file.mimetype });

      const { data } = supabaseAdmin.storage
        .from("user-assets")
        .getPublicUrl(fileName);

      newImgUrl = data.publicUrl;

      if (lookupUser.user.profileImgUrl) {
        const oldPath = lookupUser.user.profileImgUrl.split("/user-assets/")[1];

        await supabaseAdmin.storage.from("user-assets").remove([oldPath]);
      }
    }

    await UserRepository.update(
      userId,
      name,
      phone,
      newImgUrl,
      idNumber,
      dateOfBirth,
    );
  },
};

export default UserService;
