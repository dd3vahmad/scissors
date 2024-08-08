import IUser from "../entities/user.entity";
import User from "../models/user.model";

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
