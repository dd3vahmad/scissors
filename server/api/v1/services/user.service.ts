import IUser from "../entities/user.entity";
import User from "../models/user.model";

export const getDetails = async (userId: string | undefined) => {
  try {
    const user: IUser | null = await User.findById(userId);
    const { __v, _id, createdAt, updatedAt, ...rest } = user?.toObject();
    return rest;
  } catch (error: any) {
    throw new Error(error.message || "Error getting user details");
  }
};
