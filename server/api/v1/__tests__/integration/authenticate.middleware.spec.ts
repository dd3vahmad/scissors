import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import authenticateToken from "../../middlewares/authenticate.middleware";
import User from "../../models/user.model";
import jwt from "jsonwebtoken";
import config from "../../../../config/server.config";

// Mock the necessary components
jest.mock("jsonwebtoken");
jest.mock("../../models/user.model");
jest.mock("../../../../config/server.config", () => ({
  server: {
    app: {
      auth: {
        JWT_SECRET: "test_secret",
      },
    },
  },
}));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("cookie-parser")());
app.use(authenticateToken);

describe("AuthenticateToken Middleware", () => {
  const mockUser = { _id: "123", apiKey: "valid-api-key" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should authenticate with a valid JWT token", async () => {
    const token = "valid.token.here";
    const decodedToken = { id: "123" };

    (jwt.verify as jest.Mock).mockImplementation(
      (
        token: string,
        secret: string,
        callback: (err: any, decoded?: any) => void
      ) => {
        if (token === "valid.token.here") {
          callback(null, decodedToken);
        } else {
          callback(new Error("Invalid token"));
        }
      }
    );

    const response = await request(app)
      .get("/")
      .set("Cookie", [`access_token=${token}`]);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Authenticated",
      user: decodedToken,
    });
  });

  it("should return 403 if JWT token is invalid", async () => {
    (jwt.verify as jest.Mock).mockImplementation(
      (
        token: string,
        secret: string,
        callback: (err: any, decoded?: any) => void
      ) => {
        callback(new Error("Invalid token"));
      }
    );

    const response = await request(app)
      .get("/")
      .set("Cookie", ["access_token=invalid.token.here"]);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: "Not authenticated" });
  });

  it("should return 401 if no token is provided", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      status: 403,
      message: "Token or API key required",
    });
  });

  it("should authenticate with a valid API key", async () => {
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
