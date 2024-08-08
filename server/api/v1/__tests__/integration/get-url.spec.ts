import { getUrl } from "./url.controller";
import { getSingleUrl } from "../services/url.service";
import { Request, Response, NextFunction } from "express";

jest.mock("../services/url.service");

describe("getUrl Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      params: { id: "urlId" },
      user: { _id: "userId" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return the formatted URL if found", async () => {
    const mockUrl = { postedBy: "userId", id: "urlId", title: "Test URL" };
    (getSingleUrl as jest.Mock).mockResolvedValue(mockUrl);

    await getUrl(req as Request, res as Response, next);

    expect(getSingleUrl).toHaveBeenCalledWith("userId", "urlId");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: "urlId", title: "Test URL" });
  });

  it("should respond with 404 if no URL is found", async () => {
    (getSingleUrl as jest.Mock).mockResolvedValue(null);

    await getUrl(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "No URL found",
      failed: true,
    });
  });

  it("should call next with an error if an exception occurs", async () => {
    const error = new Error("Error getting URL");
    (getSingleUrl as jest.Mock).mockRejectedValue(error);

    await getUrl(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
