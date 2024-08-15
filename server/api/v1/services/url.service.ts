import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import Url from "../models/url.model";
import config from "../../../config/server.config";
import IError from "../entities/error.entity";
import { IClick } from "../entities/url.entity";

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
  longUrl: string,
  generateQrCode: boolean,
  userId: string,
  backHalf?: string
) => {
  const cleanBackHalf = backHalf?.replace(" ", "");
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
    const savedUrl: any = await url.save();

    return savedUrl;
  } catch (err: IError | any) {
    throw new Error(err.message);
  }
};

export const generateQrCodeForLink = async (
  urlId?: string,
  backHalf?: string
) => {
  try {
    let url;
    if (urlId) url = await Url.findById(urlId);
    if (backHalf) url = await Url.findOne({ backHalf });
    if (!url) {
      throw new Error("No QrCode for this link");
    }
    if (url) {
      const qrCode: any = await generateNewQrCode(url.shortUrl);
      if (!qrCode) {
        throw new Error("No QrCode for this link");
      }
      url.qrCode = qrCode;
      await url.save();
      return qrCode;
    }
  } catch (err: IError | any) {
    throw new Error(err.message);
  }
};

export const getOriginalUrl = async (
  code: string,
  location: string | undefined
) => {
  try {
    const cleanCode = code.replace(" ", "");
    const url = await Url.findOne({
      shortUrl: `${server_base_url}/${cleanCode}`,
    });
    if (url) {
      url.clicks++;
      url.clicksData = [
        ...url.clicksData,
        { at: location || "Unknown", on: new Date() },
      ];
      await url.save();
      return url.longUrl;
    }
    throw new Error(`Url with this back half ${cleanCode} is not found`);
  } catch (err: IError | any) {
    throw new Error(err.message);
  }
};

export const getSingleUrl = async (userId: string, urlId: string) => {
  try {
    let url = await Url.findOne({
      postedBy: userId,
      _id: urlId,
    });
    if (url) {
      const { __v, _id, ...rest } = url.toObject();
      return {
        id: _id,
        ...rest,
      };
    }
    throw new Error(
      `Url with this Id: ${urlId} for this user ${userId} cannot not found`
    );
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

export const getUrlStats = async (userId: string, urlId: string) => {
  try {
    const url = await Url.findOne({
      postedBy: userId,
      _id: urlId,
    });
    if (url) {
      const { __v, _id, clicksData, ...rest } = url.toObject();
      return clicksData;
    }
    throw new Error("Url has no stats");
  } catch (error: IError | any) {
    throw new Error(error.message);
  }
};
export const getUrlsStats = async (userId: string) => {
  try {
    const urls = await Url.find({
      postedBy: userId,
    });
    if (urls) {
      const clicksDataArray = urls.map((url) => {
        const { __v, _id, clicksData, ...rest } = url.toObject();
        return [...clicksData];
      });
      return clicksDataArray.flat();
    }
  } catch (error: IError | any) {
    throw new Error(error.message);
  }
};

type OutputDataByDay = { on: string; clicks: number };
type OutputDataByLocation = { on: string; clicks: number; location: string };

export const formatChartData = (
  data: IClick[] | undefined,
  by: string | string[] | any
): (OutputDataByDay | OutputDataByLocation)[] => {
  try {
    if (by === "day") {
      // Create a map to store the number of clicks per day
      const clicksPerDay: { [day: string]: number } = {};

      data?.forEach((entry) => {
        const day = entry.on.toISOString().split("T")[0]; // Extract the date part (YYYY-MM-DD)

        if (!clicksPerDay[day]) {
          clicksPerDay[day] = 0;
        }

        clicksPerDay[day]++;
      });

      // Convert the map to an array of objects
      const result: OutputDataByDay[] = Object.keys(clicksPerDay).map(
        (day) => ({
          on: day,
          clicks: clicksPerDay[day],
        })
      );

      return result;
    } else if (by === "location") {
      // Create a map to store the number of clicks per location
      const clicksPerLocation: { [location: string]: number } = {};

      data?.forEach((entry) => {
        const location = entry.at; // Use the 'at' field as the location

        if (!clicksPerLocation[location]) {
          clicksPerLocation[location] = 0;
        }

        clicksPerLocation[location]++;
      });

      // Convert the map to an array of objects
      const result: OutputDataByLocation[] = Object.keys(clicksPerLocation).map(
        (location) => ({
          on: new Date().toISOString().split("T")[0], // Assuming the current date for the 'on' field
          clicks: clicksPerLocation[location],
          location: location,
        })
      );

      return result;
    } else {
      throw new Error(
        'Unsupported "by" parameter. Currently only supports "day" and "location".'
      );
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

type UData = {
  title?: string;
  longUrl?: string;
  backHalf?: string;
};

export const updateLink = async (id: string, data: UData) => {
  try {
    let updatedDatas = { title: "", longUrl: "", backHalf: "" };
    if (data.title) updatedDatas.title = data.title;
    if (data.longUrl) updatedDatas.longUrl = data.longUrl;
    if (data.backHalf) updatedDatas.backHalf = data.backHalf;

    const urlUpdated = await Url.findByIdAndUpdate(id, updatedDatas, {
      new: true,
    });
    if (!urlUpdated) {
      throw new Error("Url not found for update");
    }
    return urlUpdated;
  } catch (err: IError | any) {
    throw new Error(err.message);
  }
};

export const deleteLink = async (id: string) => {
  try {
    const item = await Url.findByIdAndDelete(id);
    if (!item) throw new Error("Cannot find url with this Id to delete");
    return item;
  } catch (err: IError | any) {
    throw new Error(err.message);
  }
};
