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
    const cachedData = await redisClient.get(queryKey);

    if (cachedData) {
      logger.info("Cache hit");
      return res.json(JSON.parse(cachedData));
    }

    // Attach redis client to the request object to be used in the route handler
    (req as any).redisClient = redisClient;
    (req as any).queryKey = queryKey;

    next();
  } catch (error) {
    logger.error("Redis Middleware Error:", error);
    next();
  }
};

export { redisClient, redisMiddleware };
