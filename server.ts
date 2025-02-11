import expressServer from "./express-server";
import loggerService from "./src/utils/logger/logger.service";

expressServer.init().catch((err) => {
  loggerService.error(null, { error: err })
});
