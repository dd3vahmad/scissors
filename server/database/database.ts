const mongoose = require("mongoose");

mongoose
  .connect(config.db.DATABASE_URI)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });
