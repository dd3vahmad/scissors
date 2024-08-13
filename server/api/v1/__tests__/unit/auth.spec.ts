import {
  createNewUser,
  signInUser,
  resendOTPToken,
  verifyEmailWithOTP,
} from "../../services/auth.service";
import User from "../../models/user.model";
import bcryptjs from "bcryptjs";
import { sendOTP } from "../../../../utils/sendotp.util";
import jwt from "jsonwebtoken";
import { error } from "../../../../utils/error.util";
import Token from "../../models/token.model";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../models/user.model");
jest.mock("../../models/token.model");
jest.mock("../../../../utils/error.util");
jest.mock("../../../../utils/sendotp.util");

describe("Authentication Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createNewUser", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should create a new user when email and username are unique", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcryptjs.hashSync as jest.Mock).mockReturnValue("hashedPassword");

      const mockUser = {
        save: jest.fn(),
      };

      (User as unknown as jest.Mock).mockImplementation(() => mockUser);

      const result = await createNewUser(
        "John",
        "Doe",
        "john_doe",
        "john@example.com",
        "password123"
      );

      expect(User.findOne).toHaveBeenCalledTimes(2);
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it("should return an error when the email is already taken", async () => {
      (User.findOne as jest.Mock).mockResolvedValueOnce({
        email: "john@example.com",
      });

      const result = await createNewUser(
        "John",
        "Doe",
        "john_doe",
        "john@example.com",
        "password123"
      );

      expect(result).toEqual(error(400, "Email is already taken"));
    });

    it("should return an error when the username is already taken", async () => {
      (User.findOne as jest.Mock).mockResolvedValueOnce(null);
      (User.findOne as jest.Mock).mockResolvedValueOnce({
        username: "john_doe",
      });

      const result = await createNewUser(
        "John",
        "Doe",
        "john_doe",
        "john@example.com",
        "password123"
      );

      expect(result).toEqual(error(400, "Username is already taken."));
    });

    it("should throw an error when an exception occurs", async () => {
      const mockError = new Error("Something went wrong");
      (User.findOne as jest.Mock).mockRejectedValue(mockError);

      await expect(
        createNewUser(
          "John",
          "Doe",
          "john_doe",
          "john@example.com",
          "password123"
        )
      ).rejects.toThrow("Something went wrong");
    });
  });

  describe("signInUser", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return a JWT token when user credentials are valid", async () => {
      const mockUser = {
        email: "john@example.com",
        password: "hashedPassword",
        isVerified: true,
        toObject: jest.fn().mockReturnValue({
          email: "john@example.com",
          password: "hashedPassword",
        }),
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcryptjs.compareSync as jest.Mock).mockReturnValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("jwtToken");

      const result = await signInUser("john@example.com", "password123");

      expect(User.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
      expect(bcryptjs.compareSync).toHaveBeenCalledWith(
        "password123",
        "hashedPassword"
      );
      expect(jwt.sign).toHaveBeenCalled();
      expect(result).toBe("jwtToken");
    });

    it("should throw an error when user is not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        signInUser("john@example.com", "password123")
      ).rejects.toThrow("User not found");
    });

    it("should throw an error when user is not verified and send OTP", async () => {
      const mockUser = {
        email: "john@example.com",
        isVerified: false,
        _id: "mockId",
        lastname: "Doe",
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        signInUser("john@example.com", "password123")
      ).rejects.toThrow("Please verify your email to continue.");
      expect(sendOTP).toHaveBeenCalledWith("john@example.com", "mockId", "Doe");
    });

    it("should throw an error when password is incorrect", async () => {
      const mockUser = {
        email: "john@example.com",
        password: "hashedPassword",
        isVerified: true,
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcryptjs.compareSync as jest.Mock).mockReturnValue(false);

      await expect(
        signInUser("john@example.com", "wrongPassword")
      ).rejects.toThrow("Wrong credentials");
    });

    it("should throw an error when an exception occurs", async () => {
      const mockError = new Error("Something went wrong");
      (User.findOne as jest.Mock).mockRejectedValue(mockError);

      await expect(
        signInUser("john@example.com", "password123")
      ).rejects.toThrow("Something went wrong");
    });
  });

  describe("resendOTPToken", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should send a new OTP when the user exists", async () => {
      const mockUser = {
        _id: "mockId",
        email: "john@example.com",
        lastname: "Doe",
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (Token.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      await resendOTPToken("john@example.com");

      expect(User.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
      expect(Token.findOneAndDelete).toHaveBeenCalledWith({ userId: "mockId" });
      expect(sendOTP).toHaveBeenCalledWith("john@example.com", "mockId", "Doe");
    });

    it("should do nothing when the user does not exist", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await resendOTPToken("nonExistent@example.com");

      expect(User.findOne).toHaveBeenCalledWith({
        email: "nonExistent@example.com",
      });
      expect(Token.findOneAndDelete).not.toHaveBeenCalled();
      expect(sendOTP).not.toHaveBeenCalled();
    });

    it("should throw an error when an exception occurs", async () => {
      const mockError = new Error("Something went wrong");
      (User.findOne as jest.Mock).mockRejectedValue(mockError);

      await expect(resendOTPToken("john@example.com")).rejects.toThrow(
        "Something went wrong"
      );
    });
  });

  describe("verifyEmailWithOTP", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should verify the user when OTP is valid", async () => {
      const mockUser = { _id: "mockId", email: "john@example.com" };
      const mockOTP = { _id: "mockOtpId", userId: "mockId" };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (Token.findOne as jest.Mock).mockResolvedValue(mockOTP);
      (User.updateOne as jest.Mock).mockResolvedValue(null);
      (Token.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      const result = await verifyEmailWithOTP("john@example.com", 123456);

      expect(User.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
      expect(Token.findOne).toHaveBeenCalledWith({ token: 123456 });
      expect(User.updateOne).toHaveBeenCalledWith(
        { _id: "mockId" },
        { $set: { isVerified: true } }
      );
      expect(Token.findByIdAndDelete).toHaveBeenCalledWith("mockOtpId");
      expect(result).toBe(true);
    });

    it("should throw an error when user does not exist", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        verifyEmailWithOTP("nonExistent@example.com", 123456)
      ).rejects.toThrow("User does not exist.");
    });

    it("should throw an error when OTP is invalid", async () => {
      const mockUser = { _id: "mockId", email: "john@example.com" };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (Token.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        verifyEmailWithOTP("john@example.com", 123456)
      ).rejects.toThrow("Invalid OTP.");
    });

    it("should throw an error when an exception occurs", async () => {
      const mockError = new Error("Something went wrong");
      (User.findOne as jest.Mock).mockRejectedValue(mockError);

      await expect(
        verifyEmailWithOTP("john@example.com", 123456)
      ).rejects.toThrow("Something went wrong");
    });
  });
});
