import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import Url from "../models/url";
import config from "../../../config/config";
import logger from "../../../utils/logger.util";

const server_base_url: string = config.server.app.BASE_URL || "";

export const generateNewQrCode = async (shortUrl: string) => {
  try {
    const qrCode = await QRCode.toDataURL(shortUrl);
    return qrCode;
  } catch (error) {
    logger.error(error);
    return false;
  }
};

export const shortenNewUrl = async (
  title: string,
  backHalf: string,
  longUrl: string,
  generateQrCode: boolean
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
        return logger.error(
          `Failed to generate qr code for this link: ${shortUrl}`
        );
      }
      qrCode = newQrCode;
    }

    url = new Url({ title, longUrl, shortUrl, backHalf: urlCode, qrCode });
    await url.save();

    return url;
  } catch (err: any) {
    logger.error("An error occurred while shortening url");
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
    logger.error(`Url with this back half ${cleanCode} is not found`);
    return null;
  } catch (err: any) {
    logger.error("An error occurred while getting url");
    return false;
  }
};
