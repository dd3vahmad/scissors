import { Request, Response, NextFunction } from "express";
import {
  getUserDetails,
  updateUserDetails,
} from "../../controllers/user.controller";
import { getDetails, updateDetails } from "../../services/user.service";
import { redisClient } from "../../middlewares/redis.middleware";
import IUser from "../../entities/user.entity";

// Mock dependencies
jest.mock("redis");
jest.mock("../../services/user.service");
jest.mock("../../middlewares/redis.middleware");
jest.mock("redis", () => ({
  createClient: jest.fn(() => ({
    on: jest.fn(),
    connect: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  })),
}));

interface ExtendedRequest extends Request {
  user: {
    _id: string;
  };
}

describe("User Controller", () => {
  let req: Partial<ExtendedRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      user: { _id: "123" },
      body: {},
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("getUserDetails", () => {
    it("should return user details and cache them in Redis", async () => {
      const mockUserDetails: IUser = {
        _id: "123",
        firstname: "John Doe",
      } as IUser;
      (getDetails as jest.Mock).mockResolvedValue(mockUserDetails);
      (redisClient.set as jest.Mock).mockResolvedValue("OK");

      (req as any).redisClient = redisClient;
      (req as any).queryKey = "test_query_key";

      await getUserDetails(req as Request, res as Response, next);

      expect(getDetails).toHaveBeenCalledWith("123");
      expect(redisClient.set).toHaveBeenCalledWith(
        "test_query_key",
        JSON.stringify(mockUserDetails),
        { EX: 60 * 60 * 24 }
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUserDetails);
    });

    it("should call next with an error if getDetails throws", async () => {
      const error = new Error("Service failure");
      (getDetails as jest.Mock).mockRejectedValue(error);

      await getUserDetails(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("updateUserDetails", () => {
    it("should update user details and clear the Redis cache", async () => {
      (updateDetails as jest.Mock).mockResolvedValue(true);
      (redisClient.del as jest.Mock).mockResolvedValue(1);

      await updateUserDetails(req as Request, res as Response, next);

      expect(updateDetails).toHaveBeenCalledWith("123", req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        failed: false,
        message: "User details updated successfully",
      });
    });

    it("should return 400 if details could not be updated", async () => {
      (updateDetails as jest.Mock).mockResolvedValue(false);

      await updateUserDetails(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        failed: false,
        message: "Unable to update details",
      });
    });

    it("should call next with an error if updateDetails throws", async () => {
      const error = new Error("Service failure");
      (updateDetails as jest.Mock).mockRejectedValue(error);

      await updateUserDetails(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
