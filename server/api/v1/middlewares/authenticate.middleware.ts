import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../../config/server.config";
import User from "../models/user.model";
import IUser from "../entities/user.entity";

// Extend Request interface with user property
declare module "express-serve-static-core" {
  interface Request {
    user?: string | JwtPayload | IUser;
  }
}

// Utility function to verify JWT tokens
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

// Middleware to authenticate using JWT or API key
const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.access_token;
    const authHeader = req.headers["authorization"];

    // Log incoming request details
    console.log("Cookies:", req.cookies);
    console.log("Headers:", req.headers);

    // Handle JWT authentication
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
        return res
          .status(403)
          .json({ message: "Not authenticated: Invalid token" });
      }
    }

    // Handle API key authentication
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const apiKey = authHeader.split(" ")[1];
      const user = await User.findOne({ apiKey });

      if (!user) {
        return res.status(403).json({ message: "Invalid API key" });
      }

      req.user = user;
      return next();
    }

    // No token or API key provided
    return res.status(403).json({ message: "Token or API key required" });
  } catch (error) {
    console.error("Middleware Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default authenticateToken;
