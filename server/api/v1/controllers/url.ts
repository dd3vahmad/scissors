import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import Url from "../models/url";

export const shortenUrl = async (req: Request, res: Response) => {
  const { longUrl, customUrl } = req.body;
  const urlCode = customUrl || uuidv4().slice(0, 8);

  try {
    let url = await Url.findOne({ longUrl });
    if (url) {
      return res.status(200).json(url);
    }

    const shortUrl = `${process.env.BASE_URL}/${urlCode}`;
    const qrCode = await QRCode.toDataURL(shortUrl);

    url = new Url({ longUrl, shortUrl, customUrl, qrCode });
    await url.save();

    res.status(201).json(url);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
};

export const redirectUrl = async (req: Request, res: Response) => {
  const { code } = req.params;

  try {
    const url = await Url.findOne({
      shortUrl: `${process.env.BASE_URL}/${code}`,
    });
    if (url) {
      url.clicks++;
      await url.save();
      return res.redirect(url.longUrl);
    }
    res.status(404).json("No URL found");
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
};
