import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import userAgent from "express-useragent";
import apiRoutes from "./api/v1/routes";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(userAgent.express());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Routes
app.use("api/v1", apiRoutes);

export default app;
