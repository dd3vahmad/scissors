import { NextFunction, Request, Response } from "express";
import {
  getOriginalUrl,
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
    const url = await getOriginalUrl(code);
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
    const url = await getOriginalUrl(code);
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
