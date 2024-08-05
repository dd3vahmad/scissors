import { Document } from "mongoose";

export default interface IToken extends Document {
  id?: string;
  userId: string;
  token: string;
}
