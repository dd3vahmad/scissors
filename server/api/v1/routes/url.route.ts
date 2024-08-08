import express from "express";
import {
  generateQrCode,
  getUrl,
  getUserLinksStats,
  getUserLinkStats,
  getUserQrCodeHistory,
  getUserUrlHistory,
  shortenUrl,
} from "../controllers/url.controller";
import { validateUrl } from "../validations/url";

const router = express.Router();

router.post("/shorten", validateUrl, shortenUrl);
router.get("/history", getUserUrlHistory);
router.get("/qrcode-history", getUserQrCodeHistory);
router.put("/generate-qrcode/:id/:backHalf", generateQrCode);
router.get("/stats", getUserLinksStats);
router.get("/:id/stats", getUserLinkStats);
router.get("/:id", getUrl);

export default router;
