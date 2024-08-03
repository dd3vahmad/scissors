import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import userAgent from "express-useragent";
import apiRoutes from "./api/v1/routes";
import cors from "cors";
import config from "./config/config";

dotenv.config();

const app = express();
const corsOptions = {
  origin:
    config.server.NODE_ENV !== "production"
      ? [config.client.landing.DEMO_BASE_URL, config.client.app.DEMO_BASE_URL]
      : [config.client.landing.LIVE_BASE_URL, config.client.app.LIVE_BASE_URL],
  credentials: true,
};

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(userAgent.express());
app.use(cors(corsOptions));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Routes
app.use("api/v1", apiRoutes);

export default app;
