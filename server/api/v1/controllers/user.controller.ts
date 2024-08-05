import { NextFunction, Request, Response } from "express";
import IUser from "../entities/user.entity";
import { getDetails } from "../services/user.service";

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
