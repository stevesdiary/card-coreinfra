import { customAlphabet } from "nanoid";
import bcrypt from "bcrypt";

import { getFromRedis, saveToRedis } from "../../../core/redis";
import { CreationAttributes } from "sequelize";
import { User, UserRole } from "../models/user.model";
import { UserResponseData, updateUserData } from "../types/type";
import sendEmail from "./email.service";

const salt = process.env.BCRYPT_SALT || 10;
// interface userUpdateData {
  // role?: UserRole;
  // first_name?: string;
  // email?: string;
  // Add other updatable fields
// }
export const registerUser = async (userData: CreationAttributes<User>) => {
  try {
    const emailExists = await User.findOne({
      where: {
        email: userData.email,
      },
    });
    if (emailExists) {
      return {
        statusCode: 400,
        status: 'fail',
        message: `User already exists, login with your email and password`,
      };
    }
    // console.log('userData', userData.username);
    const hashed = await bcrypt.hash(userData.password, salt);
    let userCreationData = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      username: userData.username,
      email: userData.email,
      password: hashed,
    };

    const { password: _, ...userRegistrationData } = userCreationData;
    const user = await User.create(userCreationData);
    if (user) {
      const nanoid = customAlphabet("1234567890", 6)();
      const verificationCode = nanoid;
      await saveToRedis(`verify:${user.email}`, verificationCode, 600);

      const emailPayload = {
        to: user.email,
        subject: "Email Verification",
        text: `Your verification code is ${verificationCode}`,
      };
      await sendEmail(emailPayload);
    }

    return {
      statusCode: 201,
      status: "success",
      message: "User registered",
      data: [userRegistrationData],
    };
  } catch (error) {
    throw error;
  }
};

export const verifyUser = async ( { email, code }: { email: string, code: string} ) => {
  try {
    const verificationCode = await getFromRedis(`verify:${email}`);
    if (verificationCode === code) {
      await User.update(
        { verified: true },
        { where: {email} },
      );
      return {
        statusCode: 200,
        status: "success",
        message: "User verified successfully",
        data: null
      };
    }
    return {
      statusCode: 400,
      status: "fail",
      message: "Invalid verification code",
      data: null
    };
  } catch (error) {
    throw error;
  }
}

export const resendCode = async (emailPayload: string ) => {
  try {
    const email = emailPayload;
    const nanoid = customAlphabet("1234567890", 6)();
    const verificationCode = nanoid;
    await saveToRedis(`verify:${email}`, verificationCode, 600);

    const emailData = {
      to: email,
      subject: "Email Verification",
      text: `Your verification code is ${verificationCode}`,
    };
    await sendEmail(emailData);
    return {
      statusCode: 200,
      status: "success",
      message: "Verification code sent to your email",
      data: [],
    };

  } catch (error) {
    console.log('Error ocurred', error)
    throw error;
  }
}

export const getAllUsers = async (): Promise<UserResponseData> => {
  try {
    let key = "fetch:allUsers";
    let fetchUsers: string | null = await getFromRedis(key);
    if (fetchUsers) {
      return {
        statusCode: 200,
        status: "success",
        message: "Users fetched from cache",
        data: JSON.parse(fetchUsers),
      };
    }
    const users = await User.findAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    if (users && users.length > 0) {
      await saveToRedis(key, JSON.stringify(users), 300);
      return {
        statusCode: 200,
        status: "success",
        message: "Users fetched from database",
        data: users,
      };
    }

    return {
      statusCode: 404,
      status: "fail",
      message: "No user found",
      data: [],
    };
  } catch (error) {
    throw error;
  }
};

export const getOneUser = async (id: string) => {
  try {
    const user = await User.findByPk(id, {
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });
    if (!user) {
      return {
        statusCode: 404,
        status: "fail",
        message: "User not found",
        data: [],
      };
    }
    return {
      statusCode: 200,
      status: "success",
      message: "User found",
      data: user,
    };
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (
  id: string,
  validatedData: any
) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return {
        statusCode: 404,
        status: "fail",
        message: "User not found",
        data: [],
      };
    }

    // Ensure that role is assigned a valid UserRole
    if (validatedData.role) {
      validatedData.role = validatedData.role as UserRole; // Cast to UserRole if necessary
    }
    // const { password: _, ...userRegistrationData } = userCreationData;
    
    const updatedUser = await user.update(validatedData);
    const { password: _, ...userUpdateData } = validatedData;
    
    return {
      statusCode: 200,
      status: "success",
      message: "User updated",
      data: userUpdateData
    };
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return {
        statusCode: 404,
        status: "fail",
        message: "User not found",
        data: [],
      };
    }
    await user.destroy();
    return {
      statusCode: 200,
      status: "success",
      message: "User deleted",
      data: [],
    };
  } catch (error) {
    throw error;
  }
}
