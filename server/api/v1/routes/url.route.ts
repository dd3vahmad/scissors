import express from "express";
import {
  getUserQrCodeHistory,
  getUserUrlHistory,
  shortenUrl,
} from "../controllers/url.controller";
import { validateUrl } from "../validations/url";

const router = express.Router();

router.post("/shorten", validateUrl, shortenUrl);
router.get("/history", getUserUrlHistory);
router.get("/qrcode-history", getUserQrCodeHistory);

export default router;
