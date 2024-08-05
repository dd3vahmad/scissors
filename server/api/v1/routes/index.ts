import express from "express";
import urlRoutes from "./url.route";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";

const router = express.Router();

router.use("/url", urlRoutes);
router.use("/auth", authRoutes);
router.use("/user", userRoutes);

export default router;
