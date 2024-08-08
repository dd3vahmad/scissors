import { createNewUser } from "../../services/auth.service";
import User from "../../models/user.model";
import bcryptjs from "bcryptjs";
import { error } from "../../../../utils/error.util";

// Mock dependencies
jest.mock("../../models/user.model");
jest.mock("bcryptjs");
jest.mock("../../../../utils/error.util");

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
    (User.findOne as jest.Mock).mockResolvedValueOnce({ username: "john_doe" });

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
