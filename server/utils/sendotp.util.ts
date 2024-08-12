import Token from "../api/v1/models/token.model";
import config from "../config/server.config";
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
        user: config.server.app.MAIL_SERVICE.USER || "tt242833@gmail.com",
        pass:
          config.server.app.MAIL_SERVICE.GOOGLE_APP_PASSWORD ||
          "ctuk sfhn mekb jaow",
      },
    });

    // Sends Email
    let info = await transporter.sendMail({
      from: `Scissors <${config.server.app.MAIL_SERVICE.USER}>`,
      to: email,
      subject: "Account Email Verification",
      html: `
        <div class="border border-green-500 rounded-md px-10 text-center">
          <h1 class="text-green-500 font-bold">Welcome to Scissors ${lastname}!</h1>
          <p>Here is your OTP</p>
          <strong class="text-green-500">${OTPToken.token}</strong>
          <p>Copy and paste the OTP to verify your Scissors account.</p>
        </div>
      `,
    });
    logger.info("Email sent successfully:", info.response);
  } catch (error: any) {
    logger.error(
      "Email failed to send. Error: " + error.message + " Stack: " + error.stack
    );
  }
};
