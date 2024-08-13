import express from "express";
import {
  deleteUrl,
  generateQrCode,
  getUrl,
  getUserLinksStats,
  getUserLinkStats,
  getUserQrCodeHistory,
  getUserUrlHistory,
  shortenUrl,
  updateUrl,
} from "../controllers/url.controller";
import { validateUrl } from "../validations/url";
import { redisMiddleware } from "../middlewares/redis.middleware";

const router = express.Router();

router.post("/shorten", validateUrl, shortenUrl);
router.get("/history", redisMiddleware, getUserUrlHistory);
router.get("/qrcode-history", redisMiddleware, getUserQrCodeHistory);
router.put("/generate-qrcode/:id/:backHalf", generateQrCode);
router.get("/stats", redisMiddleware, getUserLinksStats);
router.get("/:id/stats", redisMiddleware, getUserLinkStats);
router.get("/:id", redisMiddleware, getUrl);
router.delete("/:id", deleteUrl);
router.put("/:id", updateUrl);

export default router;
