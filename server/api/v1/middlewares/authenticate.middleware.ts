import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import config from "../../../config/server.config";
import { error } from "../../../utils/error.util";
import User from "../models/user.model";

declare module "express-serve-static-core" {
  interface Request {
    user?: string | JwtPayload;
  }
}

const verifyToken = (
  token: string,
  secret: string
): Promise<string | JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as string | JwtPayload);
      }
    });
  });
};

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.access_token;
    const authHeader = req.headers["authorization"];

    console.log("Cookies:", req.cookies);
    console.log("Headers:", req.headers);
    console.log("Token:", token);
    console.log("Auth Header:", authHeader);

    if (token) {
      try {
        const decoded = await verifyToken(
          token,
          config.server.app.auth.JWT_SECRET
        );
        req.user = decoded;
        return next();
      } catch (err) {
        console.error("JWT Verification Error:", err);
        return res.status(403).json({ message: "Not authenticated" });
      }
    }

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const apiKey = authHeader.split(" ")[1];
      const user = await User.findOne({ apiKey });

      if (!user) {
        return res
          .status(403)
          .json({ status: 403, message: "Invalid API key" });
      }

      req.user = user;
      return next();
    }

    return res
      .status(403)
      .json({ status: 403, message: "Token or API key required" });
  } catch (error) {
    console.error("Middleware Error:", error);
    next(error);
  }
};

export default authenticateToken;
