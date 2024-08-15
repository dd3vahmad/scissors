import { NextFunction, Request, Response } from "express";
import {
  deleteLink,
  formatChartData,
  generateQrCodeForLink,
  getOriginalUrl,
  getSingleUrl,
  getUrlsStats,
  getUrlStats,
  getUserUrls,
  shortenNewUrl,
  updateLink,
} from "../services/url.service";
import config from "../../../config/server.config";
import { redisClient } from "../middlewares/redis.middleware";

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
      longUrl,
      generateQrCode,
      userObj._id,
      backHalf
    );
    const queryKey = `${(req as any).user._id}_GET_/api/v1/url/history`;
    const queryKey1 = `${(req as any).user._id}_GET_/api/v1/url/qrcode-history`;
    await redisClient.del(queryKey);
    await redisClient.del(queryKey1);
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
    await (req as any).redisClient.set(
      (req as any).queryKey,
      JSON.stringify(url),
      {
        EX: 60 * 60 * 24,
      }
    );
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
  try {
    const { id } = req.params;
    const user = req.user as any;
    const url = await getSingleUrl(user._id, id);
    const { postedBy, ...formattedUrl } = url;
    if (!url) {
      return res.status(404).json({ message: "No URL found", failed: true });
    }
    await (req as any).redisClient.set(
      (req as any).queryKey,
      JSON.stringify(formattedUrl),
      {
        EX: 60 * 60 * 24,
      }
    );
    res.status(200).json(formattedUrl);
  } catch (err) {
    next(err);
  }
};

export const generateQrCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, backHalf } = req.params;
    const qrCodeGenerated = await generateQrCodeForLink(id, backHalf);
    if (!qrCodeGenerated) {
      return res.status(404).json({ message: "No URL found", failed: true });
    }
    const queryKey = `${
      (req as any).user._id
    }_GET_/api/v1/url/${id}/stats?by=day`;
    const queryKey1 = `${
      (req as any).user._id
    }_GET_/api/v1/url/${id}/stats?by=location`;
    const queryKey2 = `${(req as any).user._id}_GET_/api/v1/url/history`;
    const queryKey3 = `${(req as any).user._id}_GET_/api/v1/url/qrcode-history`;
    const queryKey4 = `${(req as any).user._id}_GET_/api/v1/url/{id}`;
    await redisClient.del(queryKey);
    await redisClient.del(queryKey1);
    await redisClient.del(queryKey2);
    await redisClient.del(queryKey3);
    await redisClient.del(queryKey4);
    res.status(200).json({
      failed: false,
      message: "QrCode generated successfully",
      qrCode: qrCodeGenerated,
    });
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
    const resObj = {
      failed: false,
      message: "User urls fetched successfully",
      data: urls,
    };
    await (req as any).redisClient.set(
      (req as any).queryKey,
      JSON.stringify(resObj),
      {
        EX: 60 * 60 * 24,
      }
    );
    res.status(200).json(resObj);
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
    const formattedCodesObj = urls.flatMap((url) => {
      const { longUrl, qrCode, id } = url;

      return qrCode
        ? {
            id,
            link: longUrl,
            qrCode,
          }
        : [];
    });
    if (!formattedCodesObj) {
      return res
        .status(404)
        .json({ message: "No Qr Code found", failed: true });
    }
    const resObj = {
      failed: false,
      message: "User qr codes fetched successfully",
      data: formattedCodesObj,
    };
    await (req as any).redisClient.set(
      (req as any).queryKey,
      JSON.stringify(resObj),
      {
        EX: 60 * 60 * 24,
      }
    );
    res.status(200).json(resObj);
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
    const urlId = req.params.id;
    const by = req.query.by || "day";
    const userObj = req.user as any;
    const clicksData = await getUrlStats(userObj._id, urlId);

    if (!clicksData) {
      return res.status(404).json({ message: "No Data found", failed: true });
    }
    const chartClicksData = formatChartData(clicksData, by);
    const resObj = {
      failed: false,
      message: "Url data fetched successfully",
      data: chartClicksData,
    };
    await (req as any).redisClient.set(
      (req as any).queryKey,
      JSON.stringify(resObj),
      {
        EX: 60 * 60 * 24,
      }
    );
    res.status(200).json(resObj);
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
    const by = req.query.by || "day";
    const userObj = req.user as any;
    const clicksData = await getUrlsStats(userObj._id);

    if (!clicksData) {
      return res.status(404).json({ message: "No Data found", failed: true });
    }
    const chartClicksData = formatChartData(clicksData, by);
    const resObj = {
      failed: false,
      message: "Urls data fetched successfully",
      data: chartClicksData,
    };
    await (req as any).redisClient.set(
      (req as any).queryKey,
      JSON.stringify(resObj),
      {
        EX: 60 * 60 * 24,
      }
    );
    res.status(200).json(resObj);
  } catch (err) {
    next(err);
  }
};

export const updateUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedUserDetails = await updateLink(id, data);
    if (!updatedUserDetails) {
      return res
        .status(400)
        .json({ failed: false, message: "Unable to delete url" });
    }
    const queryKey = `${
      (req as any).user._id
    }_GET_/api/v1/url/${id}/stats?by=day`;
    const queryKey1 = `${
      (req as any).user._id
    }_GET_/api/v1/url/${id}/stats?by=location`;
    await redisClient.del(queryKey);
    await redisClient.del(queryKey1);
    res
      .status(200)
      .json({ failed: false, message: "Url deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const deleteUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const urlDeleted = await deleteLink(id);
    if (!urlDeleted) {
      return res
        .status(400)
        .json({ failed: false, message: "Unable to delete url" });
    }
    const queryKey = `${(req as any).user._id}_GET_/api/v1/url/history`;
    const queryKey1 = `${(req as any).user._id}_GET_/api/v1/url/qrcode-history`;
    await redisClient.del(queryKey);
    await redisClient.del(queryKey1);
    res
      .status(200)
      .json({ failed: false, message: "Url deleted successfully" });
  } catch (err) {
    next(err);
  }
};
