import { Request, Response, NextFunction } from "express";
import {
  redisMiddleware,
  redisClient,
} from "../../middlewares/redis.middleware";

jest.mock("../../../v1/../../utils/logger.util");
jest.mock("redis", () => ({
  createClient: jest.fn(() => ({
    on: jest.fn(),
    connect: jest.fn(),
    get: jest.fn(),
  })),
}));

const mockRedisClient = redisClient as jest.Mocked<typeof redisClient>;

interface ExtendedRequest extends Request {
  user: {
    _id: string;
  };
}

describe("redisMiddleware", () => {
  let req: Partial<ExtendedRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      method: "GET",
      originalUrl: "/test-url",
      query: {},
      user: { _id: "123" } as any,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return cached data if available", async () => {
    const cachedData = JSON.stringify({ message: "cached data" });
    mockRedisClient.get.mockResolvedValueOnce(cachedData);

    await redisMiddleware(req as Request, res as Response, next);

    expect(mockRedisClient.get).toHaveBeenCalledWith("123_GET_/test-url");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(JSON.parse(cachedData));
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next if no cached data is available", async () => {
    mockRedisClient.get.mockResolvedValueOnce(null);

    await redisMiddleware(req as Request, res as Response, next);

    expect(mockRedisClient.get).toHaveBeenCalledWith("123_GET_/test-url");
    expect(req).toHaveProperty("redisClient", mockRedisClient);
    expect(req).toHaveProperty("queryKey", "123_GET_/test-url");
    expect(next).toHaveBeenCalled();
  });

  it("should handle errors and call next with the error", async () => {
    const error = new Error("Redis error");
    mockRedisClient.get.mockRejectedValueOnce(error);

    await redisMiddleware(req as Request, res as Response, next);

    expect(mockRedisClient.get).toHaveBeenCalledWith("123_GET_/test-url");
    expect(next).toHaveBeenCalledWith(error);
  });
});
