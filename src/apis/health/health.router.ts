import express, { Request, Response } from 'express';
import loggerService from '../../utils/logger/logger.service';

const healthRouter = express();

healthRouter.get('/', (
  _: Request,
  response: Response
) => {
  try {
    loggerService.info("Server is healthy");

    response.status(200).json({ message: "Server is healthy" });
  } catch (error) {
    loggerService.error("Server is down!", { error });

    response.status(500).json({ message: "Server is down" });
  }
})

export { healthRouter }