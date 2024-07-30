export interface ICreateLink {
  longUrl: string;
  customUrl: string;
  generateQrCode: boolean;
}

export default interface ILink {
  title: string;
  longUrl: string;
  shortUrl: string;
  customUrl?: string;
  qrCode?: string;
  clicks: number;
}
