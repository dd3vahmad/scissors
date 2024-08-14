import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import geoip from "geoip-lite";
import locationMiddleware from "../../middlewares/reqLocation.middleware";

// Mock geoip-lite for consistent testing
jest.mock("geoip-lite");

describe("Location Middleware", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(locationMiddleware);
    app.get("/", (req: Request, res: Response) => {
      res.status(200).json(req.location);
    });
  });

  it("should set location based on IP address", async () => {
    (geoip.lookup as jest.Mock).mockReturnValueOnce({ city: "New York", country: "US" });

    const response = await request(app).get("/").set("x-forwarded-for", "8.8.8.8");

    expect(geoip.lookup).toHaveBeenCalledWith("8.8.8.8");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      city: "New York",
      country: "US",
    });
  });

  it("should set location as 'Localhost' for IPv6 localhost address", async () => {
    const response = await request(app).get("/").set("x-forwarded-for", "::1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      city: "Localhost",
      country: "Local",
    });
  });

  it("should set location as 'Unknown' when geoip lookup fails", async () => {
    (geoip.lookup as jest.Mock).mockReturnValueOnce(null);

    const response = await request(app).get("/").set("x-forwarded-for", "8.8.8.8");

    expect(geoip.lookup).toHaveBeenCalledWith("8.8.8.8");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      city: "Unknown",
      country: "Unknown",
    });
  });

  it("should handle missing x-forwarded-for header", async () => {
    (geoip.lookup as jest.Mock).mockReturnValueOnce({ city: "Los Angeles", country: "US" });

    const response = await request(app).get("/");

    expect(geoip.lookup).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      city: "Los Angeles",
      country: "US",
    });
  });
});
