import http from "http";
import config from "./config/server.config";
import logger from "./utils/logger.util";
import app from "./app";

const server = http.createServer(app);
const PORT = Number(config.server.PORT);

server.listen(PORT, "0.0.0.0", () => {
  logger.info(`Server running on port ${PORT}`);
});
