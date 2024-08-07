import { NextFunction, Request, Response } from "express";
import {
  formatChartData,
  getOriginalUrl,
  getUrlsStats,
  getUserUrls,
  shortenNewUrl,
} from "../services/url.service";
import config from "../../../config/config";

const client_base_url: string = config.client.app.BASE_URL || "";

export const shortenUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, longUrl, backHalf, generateQrCode } = req.body;

  try {
    const userObj = req.user as any;
    const shortUrl = await shortenNewUrl(
      title,
      backHalf,
      longUrl,
      generateQrCode,
      userObj._id
    );

    res.status(201).json(shortUrl);
  } catch (err) {
    next(err);
  }
};

export const redirectUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { code } = req.params;

  try {
    const url = await getOriginalUrl(
      code,
      req.location?.country + ", " + req.location?.city
    );
    if (!url) {
      return res.status(404).json({ message: "No URL found", failed: true });
    }
    res.redirect(url || client_base_url);
  } catch (err) {
    next(err);
  }
};

export const getUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { code } = req.params;

  try {
    const url = await getOriginalUrl(code, req.useragent?.platform);
    if (!url) {
      return res.status(404).json({ message: "No URL found", failed: true });
    }
    res.redirect(url || client_base_url);
  } catch (err) {
    next(err);
  }
};

export const getUserUrlHistory: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userObj = req.user as any;
    const urls = await getUserUrls(userObj._id);
    if (!urls) {
      return res.status(404).json({ message: "No URL found", failed: true });
    }
    res.status(200).json({
      failed: false,
      message: "User urls fetched successfully",
      data: urls,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserQrCodeHistory: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userObj = req.user as any;
    const urls = await getUserUrls(userObj._id);
    const formattedCodesObj = urls.map((url) => {
      const { longUrl, qrCode, id, ...rest } = url;

      if (qrCode)
        return {
          id,
          link: longUrl,
          qrCode,
        };
    });
    if (!formattedCodesObj) {
      return res
        .status(404)
        .json({ message: "No Qr Code found", failed: true });
    }
    res.status(200).json({
      failed: false,
      message: "User qr codes fetched successfully",
      data: formattedCodesObj,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserLinkStats: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userObj = req.user as any;
    const urls = await getUserUrls(userObj._id);
    const formattedCodesObj = urls.map((url) => {
      const { longUrl, qrCode, id, ...rest } = url;

      if (qrCode)
        return {
          id,
          link: longUrl,
          qrCode,
        };
    });
    if (!formattedCodesObj) {
      return res
        .status(404)
        .json({ message: "No Qr Code found", failed: true });
    }
    res.status(200).json({
      failed: false,
      message: "User qr codes fetched successfully",
      data: formattedCodesObj,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserLinksStats: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const by = req.query.by;
    const userObj = req.user as any;
    const clicksData = await getUrlsStats(userObj._id);
    const chartClicksData = formatChartData(clicksData, by);

    if (!clicksData) {
      return res.status(404).json({ message: "No Data found", failed: true });
    }
    res.status(200).json({
      failed: false,
      message: "Url data fetched successfully",
      data: chartClicksData,
    });
  } catch (err) {
    next(err);
  }
};
