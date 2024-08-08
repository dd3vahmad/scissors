import { Request, Response, NextFunction } from "express";
import { getUserUrlHistory } from "../../controllers/url.controller";
import { getUserUrls } from "../../services/url.service";

jest.mock("../../services/url.service");

describe("getUserUrlHistory Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      user: { _id: "userId" },
    } as any; // Using 'any' to bypass TypeScript checks
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return the user's URL history", async () => {
    const mockUrls = [{ id: "url1" }, { id: "url2" }];
    (getUserUrls as jest.Mock).mockResolvedValue(mockUrls);

    await getUserUrlHistory(req as Request, res as Response, next);

    expect(getUserUrls).toHaveBeenCalledWith("userId");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      failed: false,
      message: "User urls fetched successfully",
      data: mockUrls,
    });
  });

  it("should respond with 404 if no URLs are found", async () => {
    (getUserUrls as jest.Mock).mockResolvedValue([]);

    await getUserUrlHistory(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      failed: true,
      message: "No URLs found",
    });
  });
});
