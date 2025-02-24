import { getFromRedis, saveToRedis } from "../../../core/redis";
import { CreationAttributes } from "sequelize";
import { User } from "../models/user.model";
import { UserResponseData } from "../types/type";

export const getAllUsers = async (): Promise<UserResponseData> => {
  try {
    // let key = "fetch:allUsers";
    // let fetchUsers: string | null ;= await getFromRedis(key);
    // if (fetchUsers) {
    //   return {
    //     statusCode: 200,
    //     status: "success",
    //     message: "Users fetched from cache",
    //     data: JSON.parse(fetchUsers),
    //   };
    // }
    const users = await User.findAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    if (users && users.length > 0) {
      // await saveToRedis(key, JSON.stringify(users), 300);
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
  userData: CreationAttributes<User>
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
    const updatedUser = await user.update(userData);
    return {
      statusCode: 200,
      status: "success",
      message: "User updated",
      data: updatedUser,
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
