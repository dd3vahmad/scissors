import { Request, Response, NextFunction } from "express";
import geoip from "geoip-lite";

// Extend Express Request interface to include location
declare global {
  namespace Express {
    interface Request {
      location?: {
        city: string;
        country: string;
      };
    }
  }
}

const locationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let ip = req.headers["x-forwarded-for"] as string;

  if (!ip) {
    ip = req.socket.remoteAddress || req.connection.remoteAddress || "";
  }

  // Remove port number from the IP address (in case it's IPv6)
  ip = ip.split(",")[0].trim();

  const geo = geoip.lookup(ip);

  // Handle IPv6 localhost address
  if (ip === "::1" || ip === "127.0.0.1") {
    req.location = {
      city: "Localhost",
      country: "Local",
    };
    next();
    return;
  }

  if (geo) {
    req.location = {
      city: geo.city || "Unknown",
      country: geo.country || "Unknown",
    };
  } else {
    req.location = {
      city: "Unknown",
      country: "Unknown",
    };
  }

  next();
};

export default locationMiddleware;
