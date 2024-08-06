import mongoose, { Schema } from "mongoose";
import IUrl from "../entities/url.entity";

const UrlSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    longUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    backHalf: { type: String, unique: true },
    qrCode: { type: String },
    clicks: { type: Number, default: 0 },
    clicksData: { type: Array, default: [] },
    postedBy: { type: String, ref: "user", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUrl>("Url", UrlSchema);
