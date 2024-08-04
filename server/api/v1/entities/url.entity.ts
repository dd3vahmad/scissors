import { Document } from "mongoose";

export default interface IUrl extends Document {
  title: string;
  longUrl: string;
  shortUrl: string;
  backHalf?: string;
  qrCode?: string;
  clicks: number;
}

export interface IClick extends Document {
  at: string;
  on: Date;
}
