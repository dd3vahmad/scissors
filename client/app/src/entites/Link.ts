export default interface ILink {
  title: string;
  longUrl: string;
  shortUrl: string;
  customUrl?: null;
  qrCode?: string;
  clicks: number;
}
