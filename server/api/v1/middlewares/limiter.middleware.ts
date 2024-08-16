import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  handler: (req, res) => {
    res.status(429).json({
      message:
        "Too many requests from this IP, please try again after 15 minutes",
    });
  },
  headers: true,
});

export default limiter;
