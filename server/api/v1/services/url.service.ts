import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import Url from "../models/url.model";
import config from "../../../config/config";
import IError from "../entities/error.entity";

const server_base_url: string = config.server.app.BASE_URL || "";

export const generateNewQrCode: (
  shortUrl: string
) => Promise<string | boolean> = async (shortUrl: string) => {
  try {
    const qrCode = await QRCode.toDataURL(shortUrl);
    return qrCode;
  } catch (error: IError | any) {
    throw new Error(error.message);
  }
};

export const shortenNewUrl = async (
  title: string,
  backHalf: string,
  longUrl: string,
  generateQrCode: boolean,
  userId: string
) => {
  const cleanBackHalf = backHalf.replace(" ", "");
  const urlCode = cleanBackHalf || uuidv4().slice(0, 8);

  try {
    let url = await Url.findOne({ longUrl });
    let qrCode = undefined;

    if (url) {
      return url;
    }

    const shortUrl = `${server_base_url}/${urlCode}`;
    if (generateQrCode) {
      const newQrCode = await generateNewQrCode(shortUrl);
      if (!newQrCode) {
        throw new Error(
          `Failed to generate qr code for this link: ${shortUrl}`
        );
      }
      qrCode = newQrCode;
    }

    url = new Url({
      title,
      longUrl,
      shortUrl,
      backHalf: urlCode,
      qrCode,
      postedBy: userId,
    });
    await url.save();

    return url;
  } catch (err: IError | any) {
    throw new Error(err.message);
  }
};

export const getOriginalUrl = async (code: string) => {
  try {
    const cleanCode = code.replace(" ", "");
    const url = await Url.findOne({
      shortUrl: `${server_base_url}/${cleanCode}`,
    });
    if (url) {
      url.clicks++;
      await url.save();
      return url.longUrl;
    }
    throw new Error(`Url with this back half ${cleanCode} is not found`);
  } catch (err: IError | any) {
    throw new Error(err.message);
  }
};

export const getUserUrls = async (userId: string) => {
  try {
    const urls = await Url.find({
      postedBy: userId,
    });
    if (urls) {
      const formattedUrls = urls.map((url) => {
        const { __v, _id, ...rest } = url.toObject();
        return {
          id: _id,
          ...rest,
        };
      });
      return formattedUrls;
    }
    throw new Error(`Urls for this user ${userId} cannot not found`);
  } catch (err: IError | any) {
    throw new Error(err.message);
  }
};

export const getUrlStats = async (code: string) => {
  try {
    const cleanCode = code.replace(" ", "");
    const url = await Url.findOne({
      shortUrl: `${server_base_url}/${cleanCode}`,
    });
  } catch (error: IError | any) {
    throw new Error(error.message);
  }
};
