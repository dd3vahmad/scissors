import dotenv from "dotenv";

dotenv.config();

const config = {
  server: {
    PORT: Number(process.env.PORT),
    HOSTNAME: process.env.HOSTNAME,
    BACKLOG: Number(process.env.BACKLOG),
  },
  db: {
    DATABASE_URI: "",
  },
};

export default config;
