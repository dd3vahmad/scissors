import express from "express";
import { getUserDetails } from "../controllers/user.controller";

const router = express.Router();

router.get("/user-details", getUserDetails);

export default router;
