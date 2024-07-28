import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import Url from "../models/url";
import config from "../../../config/config";
import logger from "../../../utils/logger.util";

export const shortenUrl = async (
  customUrl: string,
  longUrl: string,
  generateQrCode: boolean
) => {
  const urlCode = customUrl || uuidv4().slice(0, 8);

  try {
    let url = await Url.findOne({ longUrl });
    let qrCode = undefined;

    if (url) {
      return url;
    }

    const shortUrl = `${config.app.BASE_URL}/${urlCode}`;
    if (generateQrCode) {
      qrCode = await QRCode.toDataURL(shortUrl);
    }

    url = new Url({ longUrl, shortUrl, customUrl, qrCode });
    await url.save();

    return url;
  } catch (err: any) {
    console.error(err);
    logger.error("An error occurred while shortening url");
    throw new Error(err.message);
  }
};

export const redirectUrl = async (code: string) => {
  try {
    const url = await Url.findOne({
      shortUrl: `${config.app.BASE_URL}/${code}`,
    });
    if (url) {
      url.clicks++;
      await url.save();
      return url.longUrl;
    }
    throw new Error("No URL found");
  } catch (err: any) {
    console.error(err);
    logger.error("An error occurred while redirecting url");
    throw new Error(err.message);
  }
};
