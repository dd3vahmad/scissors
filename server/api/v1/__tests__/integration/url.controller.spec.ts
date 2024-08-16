import {
  shortenUrl,
  getUrl,
  generateQrCode,
  getUserUrlHistory,
  getUserQrCodeHistory,
  getUserLinkStats,
  updateUrl,
  deleteUrl,
  getUserLinksStats,
} from "../../controllers/url.controller";
import {
  shortenNewUrl,
  getSingleUrl,
  generateQrCodeForLink,
  getUserUrls,
  formatChartData,
  getUrlStats,
  getUrlsStats,
} from "../../services/url.service";
import { Request, Response, NextFunction } from "express";

jest.mock("../../services/url.service");
jest.mock("../../controllers/url.controller", () => ({
  deleteUrl: jest.fn(),
}));
jest.mock("redis", () => ({
  createClient: jest.fn(() => ({
    on: jest.fn(),
    connect: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  })),
}));

interface ExtendedRequest extends Request {
  user: {
    _id: string;
  };
}

describe("Url Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("shortenUrl Controller", () => {
    let req: Partial<ExtendedRequest>;
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

  describe("getUrl Controller", () => {
    let req: Partial<ExtendedRequest>;
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

  describe("generateQrCode Controller", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
      req = {
        params: { id: "urlId", backHalf: "backHalf" },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    it("should generate a QR code if URL is found", async () => {
      const mockQrCode = "generatedQrCode";
      (generateQrCodeForLink as jest.Mock).mockResolvedValue(mockQrCode);

      await generateQrCode(req as Request, res as Response, next);

      expect(generateQrCodeForLink).toHaveBeenCalledWith("urlId", "backHalf");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        failed: false,
        message: "QrCode generated successfully",
        qrCode: mockQrCode,
      });
    });

    it("should respond with 404 if no URL is found", async () => {
      (generateQrCodeForLink as jest.Mock).mockResolvedValue(null);

      await generateQrCode(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "No URL found",
        failed: true,
      });
    });

    it("should call next with an error if an exception occurs", async () => {
      const error = new Error("Error generating QR code");
      (generateQrCodeForLink as jest.Mock).mockRejectedValue(error);

      await generateQrCode(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getUserUrlHistory Controller", () => {
    let req: Partial<ExtendedRequest>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
      req = {
        user: { _id: "userId" },
      } as any;
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

  describe("getUserQrCodeHistory", () => {
    let req: Partial<ExtendedRequest>;
    let res: Partial<Response>;
    let next: NextFunction;

    it("should return user QR code history", async () => {
      const user = { _id: "userId" };
      req.user = user;

      const urls = [
        { longUrl: "http://example.com", qrCode: "qrCode", id: "id" },
      ];
      (getUserUrls as jest.Mock).mockResolvedValue(urls);

      await getUserQrCodeHistory(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        failed: false,
        message: "User qr codes fetched successfully",
        data: [{ id: "id", link: "http://example.com", qrCode: "qrCode" }],
      });
    });

    it("should handle errors", async () => {
      const error = new Error("Some error");
      (getUserUrls as jest.Mock).mockRejectedValue(error);

      await getUserQrCodeHistory(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getUserLinkStats", () => {
    let req: Partial<ExtendedRequest>;
    let res: Response;
    let next: NextFunction;

    it("should return user link stats", async () => {
      req.params = { id: "urlId" };
      req.query = { by: "day" };
      const user = { _id: "userId" };
      req.user = user;

      const stats = [{ date: "2024-01-01", clicks: 10 }];
      (getUrlStats as jest.Mock).mockResolvedValue(stats);
      (formatChartData as jest.Mock).mockReturnValue(stats);

      await getUserLinkStats(req as any, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        failed: false,
        message: "Url data fetched successfully",
        data: stats,
      });
    });

    it("should handle errors", async () => {
      const error = new Error("Some error");
      (getUrlStats as jest.Mock).mockRejectedValue(error);

      await getUserLinkStats(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getUserLinksStats", () => {
    let req: Partial<ExtendedRequest> | any;
    let res: Response;
    let next: NextFunction;

    it("should return user links stats", async () => {
      req.query = { by: "day" };
      const user = { _id: "userId" };
      req.user = user;

      const stats = [{ date: "2024-01-01", clicks: 10 }];
      (getUrlsStats as jest.Mock).mockResolvedValue(stats);
      (formatChartData as jest.Mock).mockReturnValue(stats);

      await getUserLinksStats(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        failed: false,
        message: "Urls data fetched successfully",
        data: stats,
      });
    });

    it("should handle errors", async () => {
      const error = new Error("Some error");
      (getUrlsStats as jest.Mock).mockRejectedValue(error);

      await getUserLinksStats(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("updateUrl", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;

    it("should update a URL successfully", async () => {
      req.params = { id: "urlId" };
      req.body = { title: "New title" };
      const updatedLink = { longUrl: "http://example.com", title: "New title" };
      (updateUrl as jest.Mock).mockResolvedValue(updatedLink);

      await updateUrl(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        failed: false,
        message: "Url updated successfully",
        data: updatedLink,
      });
    });

    it("should handle errors", async () => {
      const error = new Error("Some error");
      (updateUrl as jest.Mock).mockRejectedValue(error);

      await updateUrl(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("deleteUrl", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
      req = {
        params: {},
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    it("should delete a URL successfully", async () => {
      req.params = { id: "urlId" };
      (deleteUrl as jest.Mock).mockResolvedValue({});

      await deleteUrl(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        failed: false,
        message: "Url deleted successfully",
      });
    });

    it("should handle errors", async () => {
      const error = new Error("Some error");
      (deleteUrl as jest.Mock).mockRejectedValue(error);

      await deleteUrl(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
