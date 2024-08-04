import express from "express";
import urlRoutes from "./url.route";

const router = express.Router();

router.use("/url", urlRoutes);

export default router;
