import { shortenUrl } from "./url.controller";
import { shortenNewUrl } from "../services/url.service";
import { Request, Response, NextFunction } from "express";

jest.mock("../services/url.service");

describe("shortenUrl Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {
        title: "Test URL",
        longUrl: "http://example.com",
        backHalf: "example",
        generateQrCode: false,
      },
      user: { _id: "userId" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should shorten a new URL and return it", async () => {
    const mockShortUrl = { shortUrl: "http://short.url/example" };
    (shortenNewUrl as jest.Mock).mockResolvedValue(mockShortUrl);

    await shortenUrl(req as Request, res as Response, next);

    expect(shortenNewUrl).toHaveBeenCalledWith(
      "Test URL",
      "example",
      "http://example.com",
      false,
      "userId"
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockShortUrl);
  });

  it("should call next with an error if shortening fails", async () => {
    const error = new Error("Shortening failed");
    (shortenNewUrl as jest.Mock).mockRejectedValue(error);

    await shortenUrl(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
