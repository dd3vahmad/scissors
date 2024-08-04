import mongoose, { Schema } from "mongoose";
import IUser from "../entities/user.entity";

const UrlSchema: Schema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UrlSchema);
