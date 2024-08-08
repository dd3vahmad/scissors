import { signInUser } from "../../services/auth.service";
import User from "../../models/user.model";
import bcryptjs from "bcryptjs";
import { sendOTP } from "../../../../utils/sendotp.util";
import jwt from "jsonwebtoken";

// Mock dependencies
jest.mock("../../models/user.model");
jest.mock("bcryptjs");
jest.mock("../../../../utils/sendotp.util");
jest.mock("jsonwebtoken");

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

    await expect(signInUser("john@example.com", "password123")).rejects.toThrow(
      "User not found"
    );
  });

  it("should throw an error when user is not verified and send OTP", async () => {
    const mockUser = {
      email: "john@example.com",
      isVerified: false,
      _id: "mockId",
      lastname: "Doe",
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    await expect(signInUser("john@example.com", "password123")).rejects.toThrow(
      "Please verify your email to continue."
    );
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

    await expect(signInUser("john@example.com", "password123")).rejects.toThrow(
      "Something went wrong"
    );
  });
});
