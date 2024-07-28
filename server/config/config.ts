import dotenv from "dotenv";

dotenv.config();

const config = {
  server: {
    PORT: process.env.PORT,
    HOSTNAME: process.env.HOSTNAME,
    BACKLOG: process.env.BACKLOG,
  },
  app: {
    BASE_URL: process.env.BASE_URL,
  },
  db: {
    DATABASE_URI: process.env.DATABASE_URI || "",
  },
};

export default config;
