import { Document } from "mongoose";

export default interface IUrl extends Document {
  title: string;
  longUrl: string;
  shortUrl: string;
  backHalf?: string;
  qrCode?: string;
  clicks: number;
  clicksData: IClick[];
  postedBy: string;
}

export interface IClick {
  at: string;
  on: Date;
}
