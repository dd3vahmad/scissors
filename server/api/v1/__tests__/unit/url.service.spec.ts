import {
  shortenNewUrl,
  getOriginalUrl,
  generateQrCodeForLink,
  updateLink,
  deleteLink,
} from "../../services/url.service";
import Url from "../../models/url.model";
import QRCode from "qrcode";

jest.mock("../../models/url.model");
jest.mock("qrcode");

describe("URL Service Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("shortenNewUrl", () => {
    it("should create a new shortened URL", async () => {
      const mockUrl = {
        _id: "url_id",
        title: "Test Title",
        longUrl: "https://example.com",
        shortUrl: "http://short.url/abcd1234",
        backHalf: "abcd1234",
        postedBy: "user_id",
        save: jest.fn(),
      };

      (Url.findOne as jest.Mock).mockResolvedValue(null);
      (Url.prototype.save as jest.Mock).mockResolvedValue(mockUrl);

      const result = await shortenNewUrl(
        "Test Title",
        "https://example.com",
        false,
        "user_id"
      );

      expect(Url.findOne).toHaveBeenCalledWith({
        longUrl: "https://example.com",
      });
      expect(Url.prototype.save).toHaveBeenCalled();
      expect(result).toEqual(mockUrl);
    });

    it("should return an existing shortened URL if it already exists", async () => {
      const mockUrl = {
        _id: "url_id",
        title: "Test Title",
        longUrl: "https://example.com",
        shortUrl: "http://short.url/abcd1234",
        backHalf: "abcd1234",
        postedBy: "user_id",
      };

      (Url.findOne as jest.Mock).mockResolvedValue(mockUrl);

      const result = await shortenNewUrl(
        "Test Title",
        "https://example.com",
        false,
        "user_id"
      );

      expect(Url.findOne).toHaveBeenCalledWith({
        longUrl: "https://example.com",
      });
      expect(result).toEqual(mockUrl);
    });

    it("should generate a QR code when generateQrCode is true", async () => {
      const mockUrl = {
        _id: "url_id",
        title: "Test Title",
        longUrl: "https://example.com",
        shortUrl: "http://short.url/abcd1234",
        backHalf: "abcd1234",
        postedBy: "user_id",
        qrCode: "qr_code_data",
        save: jest.fn(),
      };

      (Url.findOne as jest.Mock).mockResolvedValue(null);
      (Url.prototype.save as jest.Mock).mockResolvedValue(mockUrl);
      (QRCode.toDataURL as jest.Mock).mockResolvedValue("qr_code_data");

      const result = await shortenNewUrl(
        "Test Title",
        "https://example.com",
        true,
        "user_id"
      );

      expect(QRCode.toDataURL).toHaveBeenCalledWith(
        "http://short.url/abcd1234"
      );
      expect(result.qrCode).toEqual("qr_code_data");
    });
  });

  describe("getOriginalUrl", () => {
    it("should return the original URL and increment clicks", async () => {
      const mockUrl = {
        _id: "url_id",
        longUrl: "https://example.com",
        shortUrl: "http://short.url/abcd1234",
        clicks: 0,
        clicksData: [],
        save: jest.fn(),
      };

      (Url.findOne as jest.Mock).mockResolvedValue(mockUrl);

      const result = await getOriginalUrl("abcd1234", "New York");

      expect(Url.findOne).toHaveBeenCalledWith({
        shortUrl: "http://short.url/abcd1234",
      });
      expect(mockUrl.clicks).toBe(1);
      expect(mockUrl.clicksData).toHaveLength(1);
      expect(mockUrl.save).toHaveBeenCalled();
      expect(result).toEqual("https://example.com");
    });

    it("should throw an error if URL is not found", async () => {
      (Url.findOne as jest.Mock).mockResolvedValue(null);

      await expect(getOriginalUrl("abcd1234", "New York")).rejects.toThrow(
        "Url with this back half abcd1234 is not found"
      );
    });
  });

  describe("generateQrCodeForLink", () => {
    it("should generate a QR code for an existing link", async () => {
      const mockUrl = {
        _id: "url_id",
        shortUrl: "http://short.url/abcd1234",
        qrCode: null,
        save: jest.fn(),
      };

      (Url.findById as jest.Mock).mockResolvedValue(mockUrl);
      (QRCode.toDataURL as jest.Mock).mockResolvedValue("qr_code_data");

      const result = await generateQrCodeForLink("url_id");

      expect(Url.findById).toHaveBeenCalledWith("url_id");
      expect(QRCode.toDataURL).toHaveBeenCalledWith(
        "http://short.url/abcd1234"
      );
      expect(mockUrl.qrCode).toEqual("qr_code_data");
      expect(mockUrl.save).toHaveBeenCalled();
      expect(result).toEqual("qr_code_data");
    });

    it("should throw an error if URL is not found", async () => {
      (Url.findById as jest.Mock).mockResolvedValue(null);

      await expect(generateQrCodeForLink("url_id")).rejects.toThrow(
        "No QrCode for this link"
      );
    });
  });

  describe("updateLink", () => {
    it("should update a link with provided data", async () => {
      const mockUpdatedUrl = {
        _id: "url_id",
        title: "Updated Title",
        longUrl: "https://updated.com",
        backHalf: "updated",
      };

      (Url.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedUrl);

      const result = await updateLink("url_id", {
        title: "Updated Title",
        longUrl: "https://updated.com",
        backHalf: "updated",
      });

      expect(Url.findByIdAndUpdate).toHaveBeenCalledWith(
        "url_id",
        {
          title: "Updated Title",
          longUrl: "https://updated.com",
          backHalf: "updated",
        },
        { new: true }
      );
      expect(result).toEqual(mockUpdatedUrl);
    });

    it("should throw an error if URL is not found", async () => {
      (Url.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await expect(
        updateLink("url_id", {
          title: "Updated Title",
        })
      ).rejects.toThrow("Url not found for update");
    });
  });

  describe("deleteLink", () => {
    it("should delete a link by ID", async () => {
      const mockUrl = {
        _id: "url_id",
      };

      (Url.findByIdAndDelete as jest.Mock).mockResolvedValue(mockUrl);

      const result = await deleteLink("url_id");

      expect(Url.findByIdAndDelete).toHaveBeenCalledWith("url_id");
      expect(result).toEqual(mockUrl);
    });

    it("should throw an error if URL is not found for deletion", async () => {
      (Url.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await expect(deleteLink("url_id")).rejects.toThrow(
        "Cannot find url with this Id to delete"
      );
    });
  });
});
