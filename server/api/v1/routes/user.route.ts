import express from "express";
import {
  getUserDetails,
  updateUserDetails,
} from "../controllers/user.controller";
import { redisMiddleware } from "../middlewares/redis.middleware";

const router = express.Router();

router.get("/user-details", redisMiddleware, getUserDetails);
router.put("/user-details", updateUserDetails);

export default router;
