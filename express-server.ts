
import express from 'express';
import cors from 'cors'
import serverConstant from './src/constant/server.constant';
import loggerService from './src/utils/logger/logger.service';
import { mysql } from './src/database/mysql';
import { asyncContextStore } from './src/utils/helper/async_context_store.util';
import { mainRouter } from './src/apis/main.router';

class ExpressServer {
  private static instance: ExpressServer;
  private app: express.Express;
  private port: number = serverConstant.app.port;

  constructor() {
    this.app = express();
    this.initilizeMiddleware();
  }

  public static getInstance(): ExpressServer {
    if (!ExpressServer.instance) {
      ExpressServer.instance = new ExpressServer();
    }

    return ExpressServer.instance;
  }

  private initilizeMiddleware() {
    try {
      loggerService.info("executing middleware");

      this.app.use(cors());
      this.app.use(express.json({}))

      loggerService.info("execution completed -> middleware")
    } catch (error) {
      loggerService.error(null, { error });
    }
  }

  private initilizeRoutes() {
    loggerService.info("initilizeRoutes started");

    this.app.use((req, res, next) => {
      asyncContextStore.runContext({}, () => {
        asyncContextStore.setTraceId();

        next();
      })
    })
    this.app.use('/api', mainRouter)

    loggerService.info("initilizeRoutes complete");
  }

  public async init() {
    this.initilizeMiddleware();
    await mysql.authenticate();

    this.app.listen(this.port, async () => {
      loggerService.notice(`Server is running on port ${this.port}`);
      
      this.initilizeRoutes();
    });
  }
}

export default ExpressServer.getInstance();