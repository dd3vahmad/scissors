import express from "express";
import urlRoutes from "./url.route";
import authRoutes from "./auth.route";

const router = express.Router();

router.use("/url", urlRoutes);
router.use("/auth", authRoutes);

export default router;
