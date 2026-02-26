import { createApp } from "./server.js";
import { env } from "./config/env.js";
import { logger } from "./services/logger.js";

const app = createApp();

app.listen(env.BACKEND_PORT, () => {
  logger.info({ port: env.BACKEND_PORT }, "backend listening");
});
