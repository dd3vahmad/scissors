import { NextFunction, Request, Response } from "express";
import IUser from "../entities/user.entity";
import { getDetails, updateDetails } from "../services/user.service";
import { redisClient } from "../middlewares/redis.middleware";

export const getUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as IUser;
    const userDetails: IUser = await getDetails(user._id);

    await (req as any).redisClient.set(
      (req as any).queryKey,
      JSON.stringify(userDetails),
      {
        EX: 60 * 60 * 24,
      }
    );

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

    const queryKey = `${(req as any).user._id}_GET_/api/v1/user/user-details`;
    await redisClient.del(queryKey);
    res
      .status(200)
      .json({ failed: false, message: "Details updated successfully" });
  } catch (err) {
    next(err);
  }
};
