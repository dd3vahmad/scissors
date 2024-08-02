export interface ICreateLink {
  title: string;
  longUrl: string;
  backHalf: string;
  generateQrCode: boolean;
}

export default interface ILink {
  title: string;
  longUrl: string;
  shortUrl: string;
  backHalf?: string;
  qrCode?: string;
  clicks: number;
}
