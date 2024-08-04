import dotenv from "dotenv";

dotenv.config();

const config = {
  server: {
    PORT: process.env.PORT,
    HOSTNAME: process.env.HOSTNAME,
    BACKLOG: process.env.BACKLOG,
    app: {
      BASE_URL:
        process.env.NODE_ENV !== "production"
          ? process.env.SERVER_DEMO_BASE_URL
          : process.env.SERVER_LIVE_BASE_URL,
      auth: {
        JWT_SECRET: process.env.JWT_SECRET || "",
      },
    },
  },
  db: {
    DATABASE_URI: process.env.DATABASE_URI || "",
  },
  client: {
    app: {
      BASE_URL:
        process.env.NODE_ENV !== "production"
          ? process.env.APP_DEMO_BASE_URL
          : process.env.APP_LIVE_BASE_URL,
    },
    landing: {
      BASE_URL:
        process.env.NODE_ENV !== "production"
          ? process.env.LANDING_DEMO_BASE_URL
          : process.env.LANDING_LIVE_BASE_URL,
    },
  },
};

export default config;
