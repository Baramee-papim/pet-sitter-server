import AppError from "../errors/AppError";
import UserRepository from "../repositories/user.repository";
import AuthService from "./auth.service";

const UserService = {
  // TODO image
  updateUser: async (
    userId: string,
    name: string,
    phone: string,
    idNumber: string | null | undefined,
    dateOfBirth: string | null | undefined,
    oldEmail: string,
    newEmail: string | undefined,
    password: string | undefined,
  ) => {
    const lookupUser = {
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

    await UserRepository.update(userId, name, phone, idNumber, dateOfBirth);
  },
};

export default UserService;
