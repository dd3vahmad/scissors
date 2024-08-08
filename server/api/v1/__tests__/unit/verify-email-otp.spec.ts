import { verifyEmailWithOTP } from "../../services/auth.service";
import User from "../../models/user.model";
import Token from "../../models/token.model";

// Mock dependencies
jest.mock("../../models/user.model");
jest.mock("../../models/token.model");

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
