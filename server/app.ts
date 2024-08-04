import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import userAgent from "express-useragent";
import apiRoutes from "./api/v1/routes";
import cors, { CorsOptions } from "cors";
import config from "./config/config";

dotenv.config();

const app = express();

const validOrigins = [
  // "http://localhost:5174",
  // "http://localhost:5173",
  config.client.landing.BASE_URL,
  config.client.app.BASE_URL,
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || validOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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
app.use("/api/v1", apiRoutes);

export default app;
