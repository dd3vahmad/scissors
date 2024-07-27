import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validateUrl = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    longUrl: Joi.string().uri().required(),
    customUrl: Joi.string().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
