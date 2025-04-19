import { Injectable } from '@nestjs/common';
import { ILoggerClientMethods } from '../logger.type';
import * as Winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
class WinstonService implements ILoggerClientMethods {
  private readonly winston: Winston.Logger;

  constructor() {
    this.winston = Winston.createLogger({
      levels: {
        error: 0,
        alert: 1,
        warn: 2,
        info: 3,
        notice: 4,
        debug: 5,
      },
      level: 'debug',
      format: Winston.format.combine(
        Winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        Winston.format.colorize({ all: true }),
        Winston.format.printf(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
        Winston.format.errors({ stack: true }),
      ),
      transports: [
        new Winston.transports.Console(),
        new DailyRotateFile({
          dirname: './logs',
          filename: '%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    });

    Winston.addColors({
      error: 'red bold',
      alert: 'magenta bold',
      warn: 'yellow bold',
      info: 'green',
      notice: 'white bold',
      debug: 'blue',
    });
  }

  public info(...args: any[]): void {
    args.forEach((args) => this.winston.info(args));
  }
  public notice(...args: any[]): void {
    args.forEach((args) => this.winston.notice(args));
  }
  public debug(...args: any[]): void {
    args.forEach((args) => this.winston.debug(args));
  }
  public error(...args: any[]): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    args.forEach((args) => args && this.winston.error(args, args?.stack));
  }
  public alert(...args: any[]): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    args.forEach((args) => args && this.winston.alert(args, args?.stack));
  }
  public warn(...args: any[]): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    args.forEach((args) => args && this.winston.warn(args));
  }
}

export { WinstonService };
