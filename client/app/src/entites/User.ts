export default interface IUser {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  apiKey?: string;
  profileImage?: string;
  numberOfUrls?: number;
  totalClicks?: number;
}
