import http from "http";
import config from "./config/config";
import logger from "./utils/logger.util";
import app from "./app";

const server = http.createServer(app);
const PORT = config.server.PORT;
const HOSTNAME = config.server.HOSTNAME;
const BACKLOG = config.server.BACKLOG;

server.listen(PORT, HOSTNAME, BACKLOG, () => {
  logger.info(`Server running on port ${PORT}`);
});
