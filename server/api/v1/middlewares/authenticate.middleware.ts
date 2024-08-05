import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import config from "../../../config/config";
import { error } from "../../../utils/error.util";

// Extend the Express Request interface to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user?: string | JwtPayload;
  }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;

  if (!token) {
    const res_error = error(401, "Token is required");
    return res.status(401).json(res_error);
  }

  jwt.verify(
    token,
    config.server.app.auth.JWT_SECRET,
    (err: VerifyErrors | null, user: string | JwtPayload | undefined) => {
      if (err) {
        return res.status(403).json({ message: "An error occurred" });
      }
      req.user = user;
      next();
    }
  );
};

export default authenticateToken;
