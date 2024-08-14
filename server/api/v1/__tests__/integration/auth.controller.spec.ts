import { Request, Response, NextFunction } from "express";
import {
  signup,
  signin,
  resendOTP,
  verifyEmail,
  signout,
} from "../../controllers/auth.controller";
import {
  createNewUser,
  resendOTPToken,
  signInUser,
  verifyEmailWithOTP,
} from "../../services/auth.service";
import { sendOTP } from "../../../../utils/sendotp.util";
import config from "../../../../config/server.config";

// Mock dependencies
jest.mock("../../services/auth.service");
jest.mock("../../../../utils/sendotp.util");

describe("Auth Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  describe("signup", () => {
    it("should create a new user and send OTP", async () => {
      const mockUser = { _id: "userId", lastname: "Doe" };
      (createNewUser as jest.Mock).mockResolvedValue(mockUser);
      (sendOTP as jest.Mock).mockResolvedValue(true);

      req.body = {
        firstname: "John",
        lastname: "Doe",
        username: "johndoe",
        email: "johndoe@example.com",
        password: "password123",
      };

      await signup(req as Request, res as Response, next);

      expect(createNewUser).toHaveBeenCalledWith(
        "John",
        "Doe",
        "johndoe",
        "johndoe@example.com",
        "password123"
      );
      expect(sendOTP).toHaveBeenCalledWith(
        "johndoe@example.com",
        "userId",
        "Doe"
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email sent successfully.",
        failed: false,
      });
    });

    it("should call next with an error if signup fails", async () => {
      const error = new Error("Signup failed");
      (createNewUser as jest.Mock).mockRejectedValue(error);

      await signup(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("signin", () => {
    it("should sign in the user and set a cookie", async () => {
      const mockToken = "jwtToken";
      (signInUser as jest.Mock).mockResolvedValue(mockToken);

      req.body = {
        email: "johndoe@example.com",
        password: "password123",
      };

      await signin(req as Request, res as Response, next);

      expect(signInUser).toHaveBeenCalledWith(
        "johndoe@example.com",
        "password123"
      );
      expect(res.cookie).toHaveBeenCalledWith("access_token", mockToken, {
        httpOnly: true,
        maxAge: 7200000,
        secure: config.server.NODE_ENV === "production",
        sameSite: config.server.NODE_ENV === "production" ? "none" : "lax",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        failed: false,
      });
    });

    it("should call next with an error if signin fails", async () => {
      const error = new Error("Signin failed");
      (signInUser as jest.Mock).mockRejectedValue(error);

      await signin(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("resendOTP", () => {
    it("should resend OTP and return success message", async () => {
      (resendOTPToken as jest.Mock).mockResolvedValue(true);

      req.body = {
        email: "johndoe@example.com",
      };

      await resendOTP(req as Request, res as Response, next);

      expect(resendOTPToken).toHaveBeenCalledWith("johndoe@example.com");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "OTP has been resent successfully",
        failed: false,
      });
    });

    it("should call next with an error if resendOTP fails", async () => {
      const error = new Error("Resend OTP failed");
      (resendOTPToken as jest.Mock).mockRejectedValue(error);

      await resendOTP(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("verifyEmail", () => {
    it("should verify email with OTP and return success message", async () => {
      (verifyEmailWithOTP as jest.Mock).mockResolvedValue(true);

      req.body = {
        email: "johndoe@example.com",
        otp: "1234",
      };

      await verifyEmail(req as Request, res as Response, next);

      expect(verifyEmailWithOTP).toHaveBeenCalledWith(
        "johndoe@example.com",
        "1234"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email Verified",
        failed: false,
      });
    });

    it("should call next with an error if verifyEmail fails", async () => {
      const error = new Error("Verify email failed");
      (verifyEmailWithOTP as jest.Mock).mockRejectedValue(error);

      await verifyEmail(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("signout", () => {
    it("should clear the access token cookie and return success message", () => {
      signout(req as Request, res as Response, next);

      expect(res.clearCookie).toHaveBeenCalledWith("access_token");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        message: "Logged Out!",
        failed: false,
      });
    });

    it("should call next with an error if signout fails", () => {
      const error = new Error("Signout failed");
      (res.clearCookie as jest.Mock).mockImplementation(() => {
        throw error;
      });

      signout(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
