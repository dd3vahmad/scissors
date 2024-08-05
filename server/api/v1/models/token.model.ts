import mongoose, { Schema } from "mongoose";
import IToken from "../entities/token.entity";

const TokenSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      ref: "user",
      required: true,
    },
    token: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IToken>("User", TokenSchema);
