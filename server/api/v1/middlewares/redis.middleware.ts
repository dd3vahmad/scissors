import { Request, Response, NextFunction } from "express";
import redis from "redis";
import logger from "../../../utils/logger.util";
import config from "../../../config/server.config";

const redisClient = redis.createClient();
// const redisClient = redis.createClient({
//   url: config.server.REDIS_URL,
// });

redisClient.on("error", (err: any) => {
  logger.error("Redis error:", err);
});

redisClient.on("ready", () => {
  logger.info("Redis connection successful");
});

redisClient.connect();

const redisMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const queryKey = `${(req as any).user._id}_${req.method}_${req.originalUrl}`;

  try {
    const cachedData = await redisClient.get(queryKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    (req as any).redisClient = redisClient;
    (req as any).queryKey = queryKey;

    next();
  } catch (error) {
    next(error);
  }
};

export { redisClient, redisMiddleware };
