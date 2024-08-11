import {
  generateNewQrCode,
  shortenNewUrl,
  getOriginalUrl,
  getSingleUrl,
  getUserUrls,
  getUrlStats,
  getUrlsStats,
  formatChartData,
} from "../../services/url.service";
import QRCode from "qrcode";
import Url from "../../models/url.model";

jest.mock("qrcode");
jest.mock("qrcode", () => ({
  toDataURL: jest.fn(),
}));
jest.mock("../models/url.model");

describe("URL Shortening Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateNewQrCode", () => {
    it("should generate a QR code for a given short URL", async () => {
      const shortUrl = "http://example.com/abc123";
      const qrCode = await generateNewQrCode(shortUrl);
      expect(QRCode.toDataURL).toHaveBeenCalledWith(shortUrl);
      expect(qrCode).toBe("mocked-qrcode-data-url");
    });

    it("should throw an error if QR code generation fails", async () => {
      (QRCode.toDataURL as jest.Mock).mockRejectedValueOnce(
        new Error("QR code generation failed")
      );
      await expect(
        generateNewQrCode("http://example.com/abc123")
      ).rejects.toThrow("QR code generation failed");
    });
  });

  describe("shortenNewUrl", () => {
    it("should create a new short URL and save it to the database", async () => {
      (Url.findOne as jest.Mock).mockResolvedValue(null);
      Url.prototype.save = jest.fn().mockResolvedValue(true);

      const url = await shortenNewUrl(
        "My Title",
        "http://example.com",
        true,
        "user123",
        "custom-backhalf",
      );

      expect(Url.findOne).toHaveBeenCalledWith({
        longUrl: "http://example.com",
      });
      expect(url.shortUrl).toContain("custom-backhalf");
      expect(url.qrCode).toBe("mocked-qrcode-data-url");
    });

    it("should return an existing URL if it already exists", async () => {
      const existingUrl = { shortUrl: "http://example.com/abc123" };
      (Url.findOne as jest.Mock).mockResolvedValue(existingUrl);

      const url = await shortenNewUrl(
        "My Title",
        "http://example.com",
        true,
        "user123",
        "custom-backhalf",
      );

      expect(Url.findOne).toHaveBeenCalledWith({
        longUrl: "http://example.com",
      });
      expect(url).toBe(existingUrl);
    });
  });

  describe("getOriginalUrl", () => {
    it("should retrieve the original long URL from a shortened code", async () => {
      const mockUrl = {
        longUrl: "http://example.com",
        clicks: 0,
        clicksData: [],
        save: jest.fn().mockResolvedValue(true),
      };
      (Url.findOne as jest.Mock).mockResolvedValue(mockUrl);

      const longUrl = await getOriginalUrl("abc123", "New York");
      expect(Url.findOne).toHaveBeenCalledWith({
        shortUrl: expect.stringContaining("abc123"),
      });
      expect(mockUrl.clicks).toBe(1);
      expect(mockUrl.save).toHaveBeenCalled();
      expect(longUrl).toBe("http://example.com");
    });

    it("should throw an error if the URL does not exist", async () => {
      (Url.findOne as jest.Mock).mockResolvedValue(null);

      await expect(getOriginalUrl("abc123", "New York")).rejects.toThrow(
        "Url with this back half abc123 is not found"
      );
    });
  });

  describe("getSingleUrl", () => {
    it("should return a single URL for a given user and URL ID", async () => {
      const mockUrl = {
        toObject: jest
          .fn()
          .mockReturnValue({ __v: 0, _id: "url123", title: "My Title" }),
      };
      (Url.findOne as jest.Mock).mockResolvedValue(mockUrl);

      const url = await getSingleUrl("user123", "url123");
      expect(Url.findOne).toHaveBeenCalledWith({
        postedBy: "user123",
        _id: "url123",
      });
      expect(url).toEqual({ id: "url123", title: "My Title" });
    });

    it("should throw an error if the URL does not exist", async () => {
      (Url.findOne as jest.Mock).mockResolvedValue(null);

      await expect(getSingleUrl("user123", "url123")).rejects.toThrow(
        "Url with this Id: url123 for this user user123 cannot not found"
      );
    });
  });

  describe("getUserUrls", () => {
    it("should return all URLs for a given user", async () => {
      const mockUrls = [
        {
          toObject: jest
            .fn()
            .mockReturnValue({ __v: 0, _id: "url1", title: "Title 1" }),
        },
        {
          toObject: jest
            .fn()
            .mockReturnValue({ __v: 0, _id: "url2", title: "Title 2" }),
        },
      ];
      (Url.find as jest.Mock).mockResolvedValue(mockUrls);

      const urls = await getUserUrls("user123");
      expect(Url.find).toHaveBeenCalledWith({ postedBy: "user123" });
      expect(urls).toEqual([
        { id: "url1", title: "Title 1" },
        { id: "url2", title: "Title 2" },
      ]);
    });

    it("should throw an error if no URLs are found", async () => {
      (Url.find as jest.Mock).mockResolvedValue([]);

      await expect(getUserUrls("user123")).rejects.toThrow(
        "Urls for this user user123 cannot not found"
      );
    });
  });

  describe("getUrlStats", () => {
    it("should return the stats for a specific URL", async () => {
      const mockUrl = {
        toObject: jest.fn().mockReturnValue({
          __v: 0,
          _id: "url123",
          clicksData: [{ at: "New York", on: new Date() }],
        }),
      };
      (Url.findOne as jest.Mock).mockResolvedValue(mockUrl);

      const stats = await getUrlStats("user123", "url123");
      expect(Url.findOne).toHaveBeenCalledWith({
        postedBy: "user123",
        _id: "url123",
      });
      expect(stats).toEqual([{ at: "New York", on: expect.any(Date) }]);
    });

    it("should throw an error if the URL has no stats", async () => {
      (Url.findOne as jest.Mock).mockResolvedValue(null);

      await expect(getUrlStats("user123", "url123")).rejects.toThrow(
        "Url has no stats"
      );
    });
  });

  describe("getUrlsStats", () => {
    it("should return the combined stats for all URLs of a user", async () => {
      const mockUrls = [
        {
          toObject: jest.fn().mockReturnValue({
            clicksData: [{ at: "New York", on: new Date() }],
          }),
        },
        {
          toObject: jest.fn().mockReturnValue({
            clicksData: [{ at: "London", on: new Date() }],
          }),
        },
      ];
      (Url.find as jest.Mock).mockResolvedValue(mockUrls);

      const stats = await getUrlsStats("user123");
      expect(Url.find).toHaveBeenCalledWith({ postedBy: "user123" });
      expect(stats).toEqual([
        { at: "New York", on: expect.any(Date) },
        { at: "London", on: expect.any(Date) },
      ]);
    });

    it("should return an empty array if the user has no URLs", async () => {
      (Url.find as jest.Mock).mockResolvedValue([]);

      const stats = await getUrlsStats("user123");
      expect(stats).toEqual([]);
    });
  });

  describe("formatChartData", () => {
    it("should format the data by day", () => {
      const mockData = [
        { on: new Date("2024-08-01"), at: "New York" },
        { on: new Date("2024-08-01"), at: "London" },
      ];
      const formattedData = formatChartData(mockData, "day");

      expect(formattedData).toEqual([{ on: "2024-08-01", clicks: 2 }]);
    });

    it("should format the data by location", () => {
      const mockData = [
        { on: new Date("2024-08-01"), at: "New York" },
        { on: new Date("2024-08-01"), at: "London" },
      ];
      const formattedData = formatChartData(mockData, "location");

      expect(formattedData).toEqual([
        { on: expect.any(String), clicks: 1, location: "New York" },
        { on: expect.any(String), clicks: 1, location: "London" },
      ]);
    });

    it('should throw an error if an unsupported "by" parameter is passed', () => {
      expect(() => formatChartData([], "unsupported")).toThrow(
        'Unsupported "by" parameter. Currently only supports "day" and "location".'
      );
    });
  });
});
