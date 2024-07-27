import { Router } from "express";
import { shortenUrl } from "../controllers/url";
import { validateUrl } from "../validations/url";

const router = Router();

router.post("/shorten", validateUrl, shortenUrl);

export default router;
