import mongoose, { Document, Schema } from "mongoose";

interface IUrl extends Document {
  title: string;
  longUrl: string;
  shortUrl: string;
  backHalf?: string;
  qrCode?: string;
  clicks: number;
}

interface IClick extends Document {
  at: string;
  on: Date;
}

const UrlSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    longUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    backHalf: { type: String, unique: true },
    qrCode: { type: String },
    clicks: { type: Number, default: 0 },
    clicksData: { type: Array, default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IUrl>("Url", UrlSchema);
