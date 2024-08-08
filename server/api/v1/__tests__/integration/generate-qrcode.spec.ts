import { generateQrCode } from "../../controllers/url.controller";
import { generateQrCodeForLink } from "../../services/url.service";
import { Request, Response, NextFunction } from "express";

jest.mock("../services/url.service");

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
