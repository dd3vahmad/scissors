export default interface IError {
  _id?: string;
  failed: boolean;
  message: string;
  statusCode: number;
}
