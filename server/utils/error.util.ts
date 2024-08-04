export const error = (message: string) => {
  const errorObj = new Error();
  errorObj.message = message;
  return errorObj;
};
