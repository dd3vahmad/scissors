import { getDetails, updateDetails } from "../../services/user.service";
import User from "../../models/user.model";
import IUser from "../../entities/user.entity";
import bcryptjs from "bcryptjs";

jest.mock("../../models/user.model");
jest.mock("bcryptjs");

describe("User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getDetails", () => {
    it("should return user details when userId is valid", async () => {
      const userId = "validUserId";
      const mockUser: Partial<IUser> = {
        email: "test@example.com",
        firstname: "John",
        lastname: "Doe",
        username: "username123",
        apiKey: "apikey123",
      };
  
      // Mocking the User.findById method to return the mock user
      (User.findById as jest.Mock).mockResolvedValueOnce({
        toObject: () => ({
          _id: userId,
          __v: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...mockUser,
        }),
      });
  
      const result = await getDetails(userId);
  
      expect(result).toEqual(mockUser);
      expect(User.findById).toHaveBeenCalledWith(userId);
    });
  
    it("should return undefined if user is not found", async () => {
      const userId = "nonExistentUserId";
  
      // Mocking the User.findById method to return null
      (User.findById as jest.Mock).mockResolvedValueOnce(null);
  
      const result = await getDetails(userId);
  
      expect(result).toBeUndefined();
      expect(User.findById).toHaveBeenCalledWith(userId);
    });
  
    it("should throw an error if userId is undefined", async () => {
      await expect(getDetails(undefined)).rejects.toThrow("User id is undefined");
    });
  
    it("should throw an error if there is an issue retrieving user details", async () => {
      const userId = "validUserId";
  
      // Mocking the User.findById method to throw an error
      (User.findById as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );
  
      await expect(getDetails(userId)).rejects.toThrow("Database error");
    });
  });

  describe("updateDetails", () => {
    it("should update user details successfully", async () => {
      const userId = "validUserId";
      const mockUser: Partial<IUser> = {
        _id: userId,
        password: "hashedPassword",
      };
  
      const updateData = {
        firstname: "John",
        lastname: "Doe",
        username: "johndoe",
        apiKey: "newApiKey",
      };
  
      (User.findById as jest.Mock).mockResolvedValueOnce(mockUser);
      (User.prototype.updateOne as jest.Mock).mockResolvedValueOnce(true);
  
      const result = await updateDetails(userId, updateData);
  
      expect(result).toBe(true);
      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(User.prototype.updateOne).toHaveBeenCalledWith(updateData);
    });
  
    it("should throw an error if user is not found", async () => {
      const userId = "invalidUserId";
  
      (User.findById as jest.Mock).mockResolvedValueOnce(null);
  
      const updateData = {
        firstname: "John",
        lastname: "Doe",
      };
  
      await expect(updateDetails(userId, updateData)).rejects.toThrow(
        "User details not found"
      );
      expect(User.findById).toHaveBeenCalledWith(userId);
    });
  
    it("should update the password if oldPassword is valid", async () => {
      const userId = "validUserId";
      const mockUser: Partial<IUser> = {
        _id: userId,
        password: "hashedPassword",
      };
  
      const updateData = {
        password: "newPassword",
        oldPassword: "oldPassword",
      };
  
      (User.findById as jest.Mock).mockResolvedValueOnce(mockUser);
      (bcryptjs.compareSync as jest.Mock).mockReturnValueOnce(true);
      (User.prototype.updateOne as jest.Mock).mockResolvedValueOnce(true);
  
      const result = await updateDetails(userId, updateData);
  
      expect(result).toBe(true);
      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(bcryptjs.compareSync).toHaveBeenCalledWith(
        "oldPassword",
        "hashedPassword"
      );
      expect(User.prototype.updateOne).toHaveBeenCalledWith({
        password: "newPassword",
      });
    });
  
    it("should throw an error if oldPassword is incorrect", async () => {
      const userId = "validUserId";
      const mockUser: Partial<IUser> = {
        _id: userId,
        password: "hashedPassword",
      };
  
      const updateData = {
        password: "newPassword",
        oldPassword: "wrongOldPassword",
      };
  
      (User.findById as jest.Mock).mockResolvedValueOnce(mockUser);
      (bcryptjs.compareSync as jest.Mock).mockReturnValueOnce(false);
  
      await expect(updateDetails(userId, updateData)).rejects.toThrow(
        "Wrong credentials"
      );
      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(bcryptjs.compareSync).toHaveBeenCalledWith(
        "wrongOldPassword",
        "hashedPassword"
      );
    });
  
    it("should throw an error if an unexpected error occurs", async () => {
      const userId = "validUserId";
      const updateData = {
        firstname: "John",
      };
  
      (User.findById as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );
  
      await expect(updateDetails(userId, updateData)).rejects.toThrow(
        "Database error"
      );
    });
  });
});
