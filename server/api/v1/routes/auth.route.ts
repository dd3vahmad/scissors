import express from "express";
import {
  resendOTP,
  signin,
  signout,
  signup,
  verifyEmail,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/login", signin);
router.post("/signup", signup);
router.post("/verifyWithOTP", verifyEmail);
router.post("/resendOTP", resendOTP);
router.get("/logout", signout);

export default router;
