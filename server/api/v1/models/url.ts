import mongoose, { Document, Schema } from "mongoose";

interface IUrl extends Document {
  title: string;
  longUrl: string;
  shortUrl: string;
  customUrl?: string;
  qrCode?: string;
  clicks: number;
}

const UrlSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    longUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    customUrl: { type: String, unique: true },
    qrCode: { type: String },
    clicks: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IUrl>("Url", UrlSchema);
