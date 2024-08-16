import IError from "../entities/error.entity";
import IUser from "../entities/user.entity";
import User from "../models/user.model";
import bcryptjs from "bcryptjs";

export const getDetails = async (userId: string | undefined) => {
  try {
    if (!userId) {
      throw new Error("User id is undefined");
    }
    const user: IUser | null = await User.findById(userId);
    if (user) {
      const { __v, _id, createdAt, updatedAt, ...rest } = user.toObject();
      return rest;
    }
    return undefined;
  } catch (error: any) {
    throw new Error(error.message || "Error getting user details");
  }
};

type UData = {
  firstname?: string;
  lastname?: string;
  username?: string;
  password?: string;
  oldPassword?: string;
  apiKey?: string;
};

export const updateDetails = async (
  id: string,
  { firstname, lastname, username, password, oldPassword, apiKey }: UData
) => {
  try {
    let updatedDatas: any = {};
    if (firstname) updatedDatas.firstname = firstname;
    if (lastname) updatedDatas.lastname = lastname;
    if (username) updatedDatas.username = username;
    if (apiKey) updatedDatas.apiKey = apiKey;

    const validUser = await User.findById(id);
    if (!validUser) {
      throw new Error("User details not found");
    }

    if (password) {
      if (!oldPassword) {
        throw new Error("Old password required");
      }
      const passwordValid = bcryptjs.compareSync(
        oldPassword,
        validUser?.password
      );
      if (!passwordValid) {
        throw new Error("Wrong credentials");
      } else {
        updatedDatas.password = password;
      }
    }

    return await validUser.updateOne(updatedDatas);
  } catch (err: IError | any) {
    throw new Error(err.message || "An unexpexted error occurred");
  }
};
