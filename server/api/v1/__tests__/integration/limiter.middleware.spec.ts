import request from "supertest";
import express from "express";
import limiter from "../../middlewares/limiter.middleware";

const app = express();
app.use(limiter);
app.get("/", (req, res) => {
  res.status(200).send("Hello, world!");
});

describe("Rate Limit Middleware", () => {
  it("should allow requests under the rate limit", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello, world!");
    expect(response.headers["x-ratelimit-limit"]).toBe("1000");
  });

  it("should block requests exceeding the rate limit", async () => {
    for (let i = 0; i < 1000; i++) {
      await request(app).get("/");
    }

    const response = await request(app).get("/");
    expect(response.status).toBe(429); // 429 Too Many Requests
    expect(response.body.message).toBe(
      "Too many requests from this IP, please try again after 15 minutes"
    );
  });

  it("should include rate limit headers in the response", async () => {
    const response = await request(app).get("/");
    expect(response.headers["x-ratelimit-limit"]).toBe("1000");
    expect(response.headers["x-ratelimit-remaining"]).toBeDefined();
    expect(response.headers["x-ratelimit-reset"]).toBeDefined();
  });
});
