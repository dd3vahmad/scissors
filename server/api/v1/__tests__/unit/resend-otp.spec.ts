import { resendOTPToken } from "../../services/auth.service";
import User from "../../models/user.model";
import Token from "../../models/token.model";
import { sendOTP } from "../../../../utils/sendotp.util";

// Mock dependencies
jest.mock("../../models/user.model");
jest.mock("../../models/token.model");
jest.mock("../../../../utils/sendotp.util");

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
