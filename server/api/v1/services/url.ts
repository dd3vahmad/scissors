import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import Url from "../models/url";
import config from "../../../config/config";
import logger from "../../../utils/logger.util";

export const generateNewQrCode = async (shortUrl: string) => {
  try {
    const qrCode = await QRCode.toDataURL(shortUrl);
    return qrCode;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const shortenNewUrl = async (
  title: string,
  backHalf: string,
  longUrl: string,
  generateQrCode: boolean
) => {
  const urlCode = backHalf || uuidv4().slice(0, 8);

  try {
    let url = await Url.findOne({ longUrl });
    let qrCode = undefined;

    if (url) {
      return url;
    }

    const shortUrl = `${config.app.BASE_URL}/${urlCode}`;
    if (generateQrCode) {
      const newQrCode = await generateNewQrCode(shortUrl);
      if (!newQrCode) {
        console.error(`Failed to generate qr code for this link: ${shortUrl}`);
        return logger.error(
          `Failed to generate qr code for this link: ${shortUrl}`
        );
      }
      qrCode = newQrCode;
    }

    url = new Url({ title, longUrl, shortUrl, backHalf, qrCode });
    await url.save();

    return url;
  } catch (err: any) {
    console.error(err);
    logger.error("An error occurred while shortening url");
  }
};

export const getOriginalUrl = async (code: string) => {
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
  }
};
