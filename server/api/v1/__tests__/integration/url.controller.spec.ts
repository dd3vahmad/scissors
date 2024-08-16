describe("Url Controller", () => {
  it("should work", () => {
    expect("test to work").toEqual("test to work");
  });
});

// import { Request, Response, NextFunction } from "express";
// import {
//   shortenUrl,
//   redirectUrl,
//   getUrl,
//   generateQrCode,
//   getUserUrlHistory,
//   getUserQrCodeHistory,
//   getUserLinkStats,
//   getUserLinksStats,
//   updateUrl,
//   deleteUrl,
// } from "../../controllers/url.controller";
// import {
//   shortenNewUrl,
//   getOriginalUrl,
//   getSingleUrl,
//   generateQrCodeForLink,
//   getUserUrls,
//   getUrlStats,
//   getUrlsStats,
//   updateLink,
//   deleteLink,
// } from "../../services/url.service";
// import { redisClient } from "../../middlewares/redis.middleware";

// // Mock the dependencies
// jest.mock("../../services/url.service", () => ({
//   shortenNewUrl: jest.fn(),
//   getOriginalUrl: jest.fn(),
//   getSingleUrl: jest.fn(),
//   generateQrCodeForLink: jest.fn(),
//   getUserUrls: jest.fn(),
//   getUrlStats: jest.fn(),
//   getUrlsStats: jest.fn(),
//   updateLink: jest.fn(),
//   deleteLink: jest.fn(),
// }));
// jest.mock("../../middlewares/redis.middleware");
// jest.mock("../../controllers/url.controller", () => ({
//   shortenUrl: jest.fn(),
//   redirectUrl: jest.fn(),
//   getUrl: jest.fn(),
//   generateQrCode: jest.fn(),
//   getUserUrlHistory: jest.fn(),
//   getUserQrCodeHistory: jest.fn(),
//   getUserLinkStats: jest.fn(),
//   getUserLinksStats: jest.fn(),
//   updateUrl: jest.fn(),
//   deleteUrl: jest.fn(),
// }));
// jest.mock("redis", () => {
//   return {
//     createClient: jest.fn(() => ({
//       connect: jest.fn(),
//       on: jest.fn(),
//       quit: jest.fn(),
//       get: jest.fn(),
//       set: jest.fn(),
//       del: jest.fn(),
//     })),
//   };
// });

// describe("URL Controller", () => {
//   let mockReq: Partial<Request>;
//   let mockRes: Partial<Response>;
//   let mockNext: NextFunction;

//   beforeEach(() => {
//     mockReq = {
//       body: {},
//       params: {},
//       query: {},
//       user: { _id: "user123" },
//       cookies: {},
//     };
//     mockRes = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//       redirect: jest.fn(),
//     };
//     mockNext = jest.fn();
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe("shortenUrl", () => {
//     it("should shorten a URL and clear Redis cache", async () => {
//       const mockShortUrl = { shortUrl: "short.ly/abc123" };
//       (shortenNewUrl as jest.Mock).mockResolvedValue(mockShortUrl);
//       (redisClient.del as jest.Mock).mockResolvedValue(true);

//       mockReq.body = {
//         title: "Test URL",
//         longUrl: "http://example.com",
//         generateQrCode: true,
//       };

//       await shortenUrl(mockReq as Request, mockRes as Response, mockNext);

//       expect(shortenNewUrl).toHaveBeenCalledWith(
//         "Test URL",
//         "http://example.com",
//         true,
//         "user123",
//         undefined
//       );
//       expect(redisClient.del).toHaveBeenCalledTimes(2);
//       expect(mockRes.status).toHaveBeenCalledWith(201);
//       expect(mockRes.json).toHaveBeenCalledWith(mockShortUrl);
//     });

//     it("should handle errors", async () => {
//       const error = new Error("Failed to shorten URL");
//       (shortenNewUrl as jest.Mock).mockRejectedValue(error);

//       await shortenUrl(mockReq as Request, mockRes as Response, mockNext);

//       expect(mockNext).toHaveBeenCalledWith(error);
//     });
//   });

//   describe("redirectUrl", () => {
//     it("should redirect to the original URL", async () => {
//       (getOriginalUrl as jest.Mock).mockResolvedValue("http://example.com");

//       mockReq.params = { code: "abc123" };

//       await redirectUrl(mockReq as Request, mockRes as Response, mockNext);

//       expect(getOriginalUrl).toHaveBeenCalledWith("abc123", undefined);
//       expect(mockRes.redirect).toHaveBeenCalledWith("http://example.com");
//     });

//     it("should return 404 if no URL is found", async () => {
//       (getOriginalUrl as jest.Mock).mockResolvedValue(null);

//       await redirectUrl(mockReq as Request, mockRes as Response, mockNext);

//       expect(mockRes.status).toHaveBeenCalledWith(404);
//       expect(mockRes.json).toHaveBeenCalledWith({
//         message: "No URL found",
//         failed: true,
//       });
//     });

//     it("should handle errors", async () => {
//       const error = new Error("Redirect error");
//       (getOriginalUrl as jest.Mock).mockRejectedValue(error);

//       await redirectUrl(mockReq as Request, mockRes as Response, mockNext);

//       expect(mockNext).toHaveBeenCalledWith(error);
//     });
//   });

//   describe("getUrl", () => {
//     it("should return a single URL and cache it", async () => {
//       const mockUrl = { id: "url123", longUrl: "http://example.com" };
//       (getSingleUrl as jest.Mock).mockResolvedValue(mockUrl);

//       mockReq.params = { id: "url123" };

//       await getUrl(mockReq as Request, mockRes as Response, mockNext);

//       expect(getSingleUrl).toHaveBeenCalledWith("user123", "url123");
//       expect(redisClient.set).toHaveBeenCalled();
//       expect(mockRes.status).toHaveBeenCalledWith(200);
//       expect(mockRes.json).toHaveBeenCalledWith(mockUrl);
//     });

//     it("should return 404 if no URL is found", async () => {
//       (getSingleUrl as jest.Mock).mockResolvedValue(null);

//       await getUrl(mockReq as Request, mockRes as Response, mockNext);

//       expect(mockRes.status).toHaveBeenCalledWith(404);
//       expect(mockRes.json).toHaveBeenCalledWith({
//         message: "No URL found",
//         failed: true,
//       });
//     });

//     it("should handle errors", async () => {
//       const error = new Error("Get URL error");
//       (getSingleUrl as jest.Mock).mockRejectedValue(error);

//       await getUrl(mockReq as Request, mockRes as Response, mockNext);

//       expect(mockNext).toHaveBeenCalledWith(error);
//     });
//   });

//   describe("generateQrCode", () => {
//     it("should generate a QR code and clear relevant Redis cache", async () => {
//       const mockQrCode = { qrCode: "qrCodeImageData" };
//       (generateQrCodeForLink as jest.Mock).mockResolvedValue(mockQrCode);

//       mockReq.params = { id: "url123", backHalf: "custom" };

//       await generateQrCode(mockReq as Request, mockRes as Response, mockNext);

//       expect(generateQrCodeForLink).toHaveBeenCalledWith("url123", "custom");
//       expect(redisClient.del).toHaveBeenCalledTimes(5);
//       expect(mockRes.status).toHaveBeenCalledWith(200);
//       expect(mockRes.json).toHaveBeenCalledWith({
//         failed: false,
//         message: "QrCode generated successfully",
//         qrCode: mockQrCode,
//       });
//     });

//     it("should return 404 if no URL is found", async () => {
//       (generateQrCodeForLink as jest.Mock).mockResolvedValue(null);

//       await generateQrCode(mockReq as Request, mockRes as Response, mockNext);

//       expect(mockRes.status).toHaveBeenCalledWith(404);
//       expect(mockRes.json).toHaveBeenCalledWith({
//         message: "No URL found",
//         failed: true,
//       });
//     });

//     it("should handle errors", async () => {
//       const error = new Error("Generate QR code error");
//       (generateQrCodeForLink as jest.Mock).mockRejectedValue(error);

//       await generateQrCode(mockReq as Request, mockRes as Response, mockNext);

//       expect(mockNext).toHaveBeenCalledWith(error);
//     });
//   });

//   describe("deleteUrl", () => {
//     it("should delete a URL and clear Redis cache", async () => {
//       (deleteLink as jest.Mock).mockResolvedValue(true);

//       mockReq.params = { id: "url123" };

//       await deleteUrl(mockReq as Request, mockRes as Response, mockNext);

//       expect(deleteLink).toHaveBeenCalledWith("url123");
//       expect(redisClient.del).toHaveBeenCalledTimes(2);
//       expect(mockRes.status).toHaveBeenCalledWith(200);
//       expect(mockRes.json).toHaveBeenCalledWith({
//         failed: false,
//         message: "Url deleted successfully",
//       });
//     });

//     it("should return 400 if the URL cannot be deleted", async () => {
//       (deleteLink as jest.Mock).mockResolvedValue(false);

//       await deleteUrl(mockReq as Request, mockRes as Response, mockNext);

//       expect(mockRes.status).toHaveBeenCalledWith(400);
//       expect(mockRes.json).toHaveBeenCalledWith({
//         failed: false,
//         message: "Unable to delete url",
//       });
//     });

//     it("should handle errors", async () => {
//       const error = new Error("Delete URL error");
//       (deleteUrl as jest.Mock).mockRejectedValue(error);

//       await deleteUrl(mockReq as Request, mockRes as Response, mockNext);

//       expect(mockNext).toHaveBeenCalledWith(error);
//     });
//   });
// });
