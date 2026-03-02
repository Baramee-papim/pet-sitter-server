import AppError from "../errors/AppError";
import UserRepository from "../repositories/user.repository";
import supabaseClient from "../supabase/client";
import { UserRole } from "../types/user";

const AuthService = {
  register: async (
    email: string,
    phone: string,
    password: string,
    role: UserRole,
  ) => {
    const lookupUser = {
      byPhone: await UserRepository.getByPhone(phone),
    };

    if (lookupUser.byPhone) {
      throw new AppError(400, "User with this phone number already exists");
    }

    const { data, error: authError } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (authError || data.user === null) {
      if (authError?.code === "user_already_exists") {
        throw new AppError(400, "User with this email already exists");
      }
      throw new AppError(400, "Failed to create user. Please try again");
    }

    await UserRepository.create(data.user.id, phone, role);
  },

  login: async (email: string, password: string) => {
    const { data, error: authError } =
      await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      if (
        authError.code === "invalid_credentials" ||
        authError.message.includes("Invalid login credentials")
      ) {
        throw new AppError(
          400,
          "Your password is incorrect or this email doesn't exist",
        );
      }
      throw new AppError(400, authError.message);
    }

    return data.session.access_token;
  },

  getUser: async (token: string) => {
    const { data, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError) {
      throw new AppError(401, "Unauthorized or token expired");
    }

    return { user: await UserRepository.getById(data.user.id), data };
  },

  changeEmail: async (oldEmail: string, newEmail: string, password: string) => {
    const { error: loginError } = await supabaseClient.auth.signInWithPassword({
      email: oldEmail,
      password: password,
    });

    if (loginError) {
      throw new AppError(400, "Invalid password");
    }

    const { error: emailError } = await supabaseClient.auth.updateUser({
      email: newEmail,
    });

    if (emailError) {
      if (emailError.code === "email_exists") {
        throw new AppError(400, "User with this new email already exists");
      }
      throw new AppError(400, emailError.message);
    }
  },

  resetPassword: async (
    token: string,
    oldPassword: string,
    newPassword: string,
  ) => {
    const { data, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError) {
      throw new AppError(401, "Unauthorized or token expired");
    }

    const { error: loginError } = await supabaseClient.auth.signInWithPassword({
      email: data.user.email!,
      password: oldPassword,
    });

    if (loginError) {
      throw new AppError(400, "Invalid old password");
    }

    const { error: passwordError } = await supabaseClient.auth.updateUser({
      password: newPassword,
    });

    if (passwordError) {
      throw new AppError(400, passwordError.message);
    }
  },
};

export default AuthService;
