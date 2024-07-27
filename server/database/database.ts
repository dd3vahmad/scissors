import config from "../config/config";
import mongoose from "mongoose";

mongoose
  .connect(config.db.DATABASE_URI)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err: any) => {
    console.log(err);
  });
