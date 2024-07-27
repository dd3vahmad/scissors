import logger from "../../../utils/logger.util";
import { NextFunction, Request, Response } from "express";

interface IRequestParams {}

interface IRequestBody {}

interface IRequestQuery {}

export const signup = (
  req: Request<IRequestParams, any, IRequestBody, IRequestQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Signs user up");
  } catch (error: any) {
    logger.error(error.message);
    next(error);
  }
};
