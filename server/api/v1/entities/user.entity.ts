import { Document } from "mongoose";

export default interface IUser extends Document {
  id?: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
}
