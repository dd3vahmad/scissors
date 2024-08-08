import { getDetails } from "../../services/user.service";
import User from "../../models/user.model";
import IUser from "../../entities/user.entity";

// Mock the User model
jest.mock("../../models/user.model");

describe("getDetails", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return user details when userId is provided and user is found", async () => {
    const mockUser: Partial<IUser> = {
      email: "test@example.com",
      firstname: "John",
      lastname: "Doe",
      username: "Pascal",
    };

    (User.findById as jest.Mock).mockResolvedValue({
      toObject: () => ({
        __v: 0,
        _id: "mockId",
        createdAt: new Date(),
        updatedAt: new Date(),
        ...mockUser,
      }),
    });

    const result = await getDetails("mockUserId");

    expect(result).toEqual(mockUser);
    expect(User.findById).toHaveBeenCalledWith("mockUserId");
  });

  it("should return null if user is not found", async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    const result = await getDetails("nonExistentUserId");

    expect(result).toBeUndefined();
    expect(User.findById).toHaveBeenCalledWith("nonExistentUserId");
  });

  it("should throw an error when userId is undefined", async () => {
    await expect(getDetails(undefined)).rejects.toThrow("User id is undefined");
    expect(User.findById).not.toHaveBeenCalled();
  });

  it("should throw an error when there is a database error", async () => {
    const mockError = new Error("Database error");
    (User.findById as jest.Mock).mockRejectedValue(mockError);

    await expect(getDetails("mockUserId")).rejects.toThrow("Database error");
    expect(User.findById).toHaveBeenCalledWith("mockUserId");
  });
});
