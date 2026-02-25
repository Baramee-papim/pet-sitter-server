import AppError from "../errors/AppError";
import UserRepository from "../repositories/user.repository";

const UserService = {
  // TODO Email
  updateUser: async (
    userId: string,
    name: string,
    email: string,
    phone: string,
    idNumber: string,
    dateOfBirth: string,
  ) => {
    const lookupUser = {
      phone: (await UserRepository.getByPhone(phone))[0],
      idNumber: (await UserRepository.getByIdNumber(idNumber))[0],
    };

    if (lookupUser.phone && lookupUser.phone.userId !== userId) {
      throw new AppError(400, "User with this phone number already exists");
    }

    if (lookupUser.idNumber && lookupUser.idNumber.userId !== userId) {
      throw new AppError(400, "User with this ID number already exists");
    }

    await UserRepository.update(userId, name, phone, idNumber, dateOfBirth);
  },
};

export default UserService;
