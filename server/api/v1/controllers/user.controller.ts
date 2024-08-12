import { NextFunction, Request, Response } from "express";
import IUser from "../entities/user.entity";
import { getDetails, updateDetails } from "../services/user.service";
import bcryptjs from "bcryptjs";

export const getUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as IUser;
    const userDetails: IUser = await getDetails(user._id);

    res.status(201).json(userDetails);
  } catch (error: any) {
    next(error);
  }
};

export const updateUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const detailsUpdated = await updateDetails((req.user as any)._id, req.body);
    if (!detailsUpdated) {
      return res
        .status(400)
        .json({ failed: false, message: "Unable to update details" });
    }
    res
      .status(200)
      .json({ failed: false, message: "Details updated successfully" });
  } catch (err) {
    next(err);
  }
};
