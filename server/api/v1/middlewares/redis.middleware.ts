import { Request, Response, NextFunction } from "express";
import redis from "redis";
import logger from "../../../utils/logger.util";
import config from "../../../config/server.config";

const redisClient = redis.createClient({
  url: config.server.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  logger.error("Redis error:", err);
});

redisClient.connect();

const redisMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const queryKey = JSON.stringify(req.query);

  try {
    // Check cache
    const cachedData = await redisClient.get(queryKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // If not cached, proceed to the route handler
    (req as any).redisClient = redisClient;
    (req as any).queryKey = queryKey;

    next();
  } catch (error) {
    logger.error("Redis Middleware Error:", error);
    next();
  }
};

export { redisClient, redisMiddleware };
