import Token from "../api/v1/models/token.model";
import logger from "./logger.util";
import nodemailer from "nodemailer";

export const sendOTP = async (
  email: string,
  userId: string | unknown,
  lastname: string
) => {
  try {
    // Generate OTP token
    const OTPToken = new Token({
      userId: userId,
      token: `${Math.floor(1000 + Math.random() * 9000)}`,
    });

    await OTPToken.save();
    // Creates Email Transporter
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    // Sends Email
    let info = await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: "Account Verification",
      html: `
        <div class="border border-green-500 rounded-md px-10 text-center">
          <h1 class="text-green-500 font-bold">Welcome to Gigsflix ${lastname}!</h1>
          <p>Here is your OTP</p>
          <h2 class="text-green-500">${OTPToken.token}</h2>
          <p>Copy and paste the OTP to verify your Gigsflix account.</p>
        </div>
      `,
    });
  } catch (error) {
    logger.error("Email fail to send.");
  }
};
