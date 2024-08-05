import { Document } from "mongoose";

export default interface IUser extends Document {
  _id?: string;
  id?: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
}
