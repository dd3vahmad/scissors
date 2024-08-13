import dotenv from "dotenv";

dotenv.config();

const config = {
  server: {
    PORT: process.env.PORT,
    HOSTNAME: process.env.HOSTNAME,
    BACKLOG: process.env.BACKLOG,
    NODE_ENV: process.env.NODE_ENV,
    REDIS_URL:
      process.env.NODE_ENV !== "production"
        ? process.env.DEMO_REDIS_URL
        : process.env.LIVE_REDIS_URL,
    app: {
      BASE_URL:
        process.env.NODE_ENV !== "production"
          ? process.env.SERVER_DEMO_BASE_URL
          : process.env.SERVER_LIVE_BASE_URL,
      auth: {
        JWT_SECRET: process.env.JWT_SECRET || "",
      },
      MAIL_SERVICE: {
        USER: process.env.USER,
        GOOGLE_APP_PASSWORD: process.env.GOOGLE_APP_PASSWORD,
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
