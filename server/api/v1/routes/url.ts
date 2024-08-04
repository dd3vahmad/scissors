import express from "express";
import { shortenUrl } from "../controllers/url";
import { validateUrl } from "../validations/url";

const router = express.Router();

router.post("/shorten", validateUrl, shortenUrl);

export default router;
