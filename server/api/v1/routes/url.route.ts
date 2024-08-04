import express from "express";
import { getUserUrlHistory, shortenUrl } from "../controllers/url.controller";
import { validateUrl } from "../validations/url";

const router = express.Router();

router.post("/shorten", validateUrl, shortenUrl);
router.get("/history", getUserUrlHistory);

export default router;
