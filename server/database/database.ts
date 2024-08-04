import config from "../config/config";
import mongoose from "mongoose";
import logger from "../utils/logger.util";

const connectDb = () =>
  mongoose
    .connect(config.db.DATABASE_URI)
    .then(() => {
      logger.info("Connected to database");
    })
    .catch((err: any) => {
      console.log(err);
      logger.info("Connected to database");
    });

export default connectDb;
