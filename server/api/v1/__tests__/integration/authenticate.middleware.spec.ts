import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import authenticateToken from "../../middlewares/authenticate.middleware";
import User from "../../models/user.model";
import config from "../../../../config/server.config";

// Mock necessary modules
jest.mock("jsonwebtoken");
jest.mock("../../models/user.model");

describe("AuthenticateToken Middleware", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(authenticateToken);
    app.get("/", (req: Request, res: Response) => {
      res.status(200).json({ message: "Authenticated", user: req.user });
    });
  });

  it("should authenticate with a valid JWT token", async () => {
    const mockUser = { id: "123", name: "Test User" };
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(null, mockUser);
    });

    const response = await request(app)
      .get("/")
      .set("Cookie", ["access_token=valid.token.here"]);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Authenticated", user: mockUser });
  });

  it("should return 401 if no token is provided", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      status: 401,
      message: "Token is required",
    });
  });

  it("should return 403 if JWT token is invalid", async () => {
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(new Error("Invalid token"), undefined);
    });

    const response = await request(app)
      .get("/")
      .set("Cookie", ["access_token=invalid.token.here"]);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: "Not authenticated" });
  });

  it("should authenticate with a valid API key", async () => {
    const mockUser = { id: "123", name: "API User" };
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app)
      .get("/")
      .set("Authorization", "Bearer valid-api-key");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Authenticated", user: mockUser });
  });

  it("should return 403 if API key is invalid", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .get("/")
      .set("Authorization", "Bearer invalid-api-key");

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ status: 403, message: "Invalid API key" });
  });

  it("should return 403 if neither token nor API key is provided", async () => {
    const response = await request(app).get("/").set("Authorization", "");

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      status: 403,
      message: "Token or API key required",
    });
  });
});
