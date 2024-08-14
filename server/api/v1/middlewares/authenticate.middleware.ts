import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import config from "../../../config/server.config";
import { error } from "../../../utils/error.util";
import User from "../models/user.model";
import { promisify } from "util";

declare module "express-serve-static-core" {
  interface Request {
    user?: string | JwtPayload;
  }
}

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.access_token;
    const authHeader = req.headers["authorization"];

    if (!token) {
      const res_error = error(401, "Token is required");
      return res.status(401).json(res_error);
    }

    if (token) {
      jwt.verify(
        token,
        config.server.app.auth.JWT_SECRET,
        (err: VerifyErrors | null, user: string | JwtPayload | undefined) => {
          if (err) {
            return res.status(403).json({ message: "Not authenticated" });
          }
          req.user = user;
          next();
        }
      );
    } else if (authHeader && authHeader.startsWith("Bearer ")) {
      const apiKey = authHeader.split(" ")[1];

      const user = await User.findOne({ apiKey: apiKey });

      if (!user) {
        const res_error = error(403, "Invalid API key");
        return res.status(403).json(res_error);
      }

      req.user = user;
      next();
    } else {
      const res_error = error(403, "Token or API key required");
      return res.status(403).json(res_error);
    }
  } catch (error) {
    next(error);
  }
};

export default authenticateToken;
