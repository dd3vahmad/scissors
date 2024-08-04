import IError from "../api/v1/entities/error.entity";

export const error = (statusCode: number, message: string) => {
  const errorObj: IError = { failed: true, statusCode, message };
  return errorObj;
};
