import dotenv from "dotenv";

dotenv.config();

const config = {
  server: {
    PORT: process.env.PORT,
    HOSTNAME: process.env.HOSTNAME,
    BACKLOG: process.env.BACKLOG,
    NODE_ENV: "development",
  },
  db: {
    DATABASE_URI: process.env.DATABASE_URI || "",
  },
  client: {
    app: {
      DEMO_BASE_URL: process.env.APP_DEMO_BASE_URL || "/",
      LIVE_BASE_URL: process.env.APP_LIVE_BASE_URL || "/",
    },
    landing: {
      DEMO_BASE_URL: process.env.LANDING_DEMO_BASE_URL || "/",
      LIVE_BASE_URL: process.env.LANDING_LIVE_BASE_URL || "/",
    },
  },
};

export default config;
