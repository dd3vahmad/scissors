import express from "express";
import {
  getUserDetails,
  updateUserDetails,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/user-details", getUserDetails);
router.put("/user-details", updateUserDetails);

export default router;
