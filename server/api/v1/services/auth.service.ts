import bcryptjs from "bcryptjs";
import User from "../models/user.model";
import { error } from "../../../utils/error.util";
import IError from "../entities/error.entity";
import IUser from "../entities/user.entity";
import Token from "../models/token.model";
import { sendOTP } from "../../../utils/sendotp.util";
import jwt from "jsonwebtoken";
import config from "../../../config/server.config";

export const createNewUser: (
  firstname: string,
  lastname: string,
  username: string,
  email: string,
  password: string
) => Promise<IUser | IError> = async (
  firstname: string,
  lastname: string,
  username: string,
  email: string,
  password: string
) => {
  try {
    const formattedUsername = username
      ?.replace(" ", "")
      ?.toLowerCase()
      ?.replace("@", "");
    const hashedPassword = password && bcryptjs.hashSync(password, 10);
    const userWithMail = await User.findOne({ email });
    if (userWithMail) {
      return error(400, "Email is already taken");
    }
    const userWithUsername = await User.findOne({
      username: formattedUsername,
    });
    if (userWithUsername) {
      return error(400, "Username is already taken.");
    }
    const newUser = new User({
      firstname,
      lastname,
      username: formattedUsername,
      email,
      password: hashedPassword,
      isVerified: false,
    });
    await newUser.save();
    return newUser;
  } catch (err: IError | any) {
    throw new Error(err.message);
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      throw new Error("User not found");
    }

    if (!validUser.isVerified) {
      await sendOTP(email, validUser._id, validUser.lastname);
      throw new Error("Please verify your email to continue.");
    }
    const validPassword =
      password && bcryptjs.compareSync(password, validUser.password || "");
    if (!validPassword) {
      throw new Error("Wrong credentials");
    }
    const { password: hashedPassword, ...rest } = validUser.toObject();
    const token = jwt.sign({ ...rest }, config.server.app.auth.JWT_SECRET);
    return token;
  } catch (error: IError | any) {
    throw new Error(error.message);
  }
};

export const resendOTPToken = async (email: string) => {
  try {
    const validUser = await User.findOne({ email });
    if (validUser) {
      await Token.findOneAndDelete({ userId: validUser._id });
      await sendOTP(validUser.email, validUser._id, validUser.lastname);
    }
  } catch (err: IError | any) {
    throw new Error(err.message);
  }
};

export const verifyEmailWithOTP = async (email: string, otp: number) => {
  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      throw new Error("User does not exist.");
    }

    const validOTP = await Token.findOne({
      token: otp,
    });

    if (!validOTP) {
      throw new Error("Invalid OTP.");
    }
    await User.updateOne(
      { _id: validOTP.userId },
      { $set: { isVerified: true } }
    );
    await Token.findByIdAndDelete(validOTP._id);
    return true;
  } catch (err: IError | any) {
    throw new Error(err.message);
  }
};
