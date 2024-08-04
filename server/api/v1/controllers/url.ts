import { Request, Response } from "express";
import { getOriginalUrl, shortenNewUrl } from "../services/url";
import config from "../../../config/config";

const client_base_url: string = config.client.app.BASE_URL || "";

export const shortenUrl = async (req: Request, res: Response) => {
  const { title, longUrl, backHalf, generateQrCode } = req.body;

  try {
    const shortUrl = await shortenNewUrl(
      title,
      backHalf,
      longUrl,
      generateQrCode
    );

    res.status(201).json(shortUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
};

export const redirectUrl = async (req: Request, res: Response) => {
  const { code } = req.params;

  try {
    const url = await getOriginalUrl(code);
    if (!url) {
      return res.status(404).json({ message: "No URL found", failed: true });
    }
    res.redirect(url || client_base_url);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
};

export const getUrl = async (req: Request, res: Response) => {
  const { code } = req.params;

  try {
    const url = await getOriginalUrl(code);
    if (!url) {
      return res.status(404).json({ message: "No URL found", failed: true });
    }
    res.redirect(url || client_base_url);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
};
