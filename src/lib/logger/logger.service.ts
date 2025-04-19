import { Injectable } from '@nestjs/common';
import { sortBy } from 'lodash';
import { ELoggerDataOrder } from './logger.enum';
import { ILoggerData, ILoggerServiceMethods } from './logger.type';
import { WinstonService } from './winston/winston.service';
import { AlsService } from 'src/core/common/als/als.service';

@Injectable()
export class LoggingService implements ILoggerServiceMethods {
  private loggerDataOrder = {
    controller: ELoggerDataOrder.controller,
    serviceName: ELoggerDataOrder.serviceName,
    function: ELoggerDataOrder.function,
    message: ELoggerDataOrder.message,
    additionalArgs: ELoggerDataOrder.additionalArgs,
  };

  constructor(
    private readonly loggerClient: WinstonService,
    private readonly alsService: AlsService,
  ) {}

  private formatter(data: ILoggerData): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const orderAttribute = sortBy(
      Object.keys(data),
      (key: string) =>
        this.loggerDataOrder[key as keyof typeof this.loggerDataOrder],
    ) as Array<keyof ILoggerData>;

    const finalMessage = orderAttribute.map((key) => {
      const value: unknown = data[key];

      if (value instanceof Object) {
        return `${key}: ${JSON.stringify(value, null, 2)}`;
      }

      return `${key}: ${value?.toString()}`;
    });

    return finalMessage.join(' ---> ');
  }

  private getTracingId() {
    return this.alsService.getTraceId();
  }

  public info(message: ILoggerData | string): void {
    const tracingId = this.getTracingId();
    let formmatedMessage: string = tracingId
      ? `tracingId: ${this.getTracingId()} --> `
      : '';

    if (typeof message !== 'string') {
      formmatedMessage += this.formatter(message);
    } else {
      formmatedMessage += message;
    }

    this.loggerClient.info(formmatedMessage);
  }

  public notice(message: ILoggerData | string): void {
    const tracingId = this.getTracingId();
    let formmatedMessage: string = tracingId
      ? `tracingId: ${this.getTracingId()} --> `
      : '';

    if (typeof message !== 'string') {
      formmatedMessage += this.formatter(message);
    } else {
      formmatedMessage += message;
    }

    this.loggerClient.notice(formmatedMessage);
  }

  public debug(message: ILoggerData | string): void {
    const tracingId = this.getTracingId();
    let formmatedMessage: string = tracingId
      ? `tracingId: ${this.getTracingId()} --> `
      : '';

    if (typeof message !== 'string') {
      formmatedMessage += this.formatter(message);
    } else {
      formmatedMessage += message;
    }

    this.loggerClient.debug(formmatedMessage);
  }

  public warn(
    message: ILoggerData | string | null,
    option?: { error?: any },
  ): void {
    const tracingId = this.getTracingId();
    let formmatedMessage: string = tracingId
      ? `tracingId: ${this.getTracingId()} --> `
      : '';

    if (message !== null) {
      if (typeof message !== 'string') {
        formmatedMessage += this.formatter(message);
      } else {
        formmatedMessage += message;
      }
    }

    this.loggerClient.warn(formmatedMessage, option?.error);
  }

  public error(
    message: ILoggerData | string | null,
    option?: { error?: any },
  ): void {
    const tracingId = this.getTracingId();
    let formmatedMessage: string = tracingId
      ? `tracingId: ${this.getTracingId()} --> `
      : '';

    if (message !== null) {
      if (typeof message !== 'string') {
        formmatedMessage += this.formatter(message);
      } else {
        formmatedMessage = message;
      }
    }

    this.loggerClient.error(formmatedMessage, option?.error);
  }

  public alert(
    message: ILoggerData | string | null,
    option?: { error?: any },
  ): void {
    const tracingId = this.getTracingId();
    let formmatedMessage: string = tracingId
      ? `tracingId: ${this.getTracingId()} --> `
      : '';

    if (message !== null) {
      if (typeof message !== 'string') {
        formmatedMessage += this.formatter(message);
      } else {
        formmatedMessage = message;
      }
    }

    this.loggerClient.alert(formmatedMessage, option?.error);
  }
}
