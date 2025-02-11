import { sortBy } from "lodash";
import { ELoggerDataOrder } from "./logger.enum";
import { ILoggerClientMethods, ILoggerData, ILoggerServiceMethods } from "./logger.type";
import winstonService from "./winston/winston.service";
import { asyncContextStore } from "../helper/async_context_store.util";


class LoggingService implements ILoggerServiceMethods {
  private static instance: LoggingService;
  private loggerClient: ILoggerClientMethods;
  private loggerDataOrder;

  private constructor(loggerCient: ILoggerClientMethods) {
    this.loggerClient = loggerCient;
    
    this.loggerDataOrder = {
      controller: ELoggerDataOrder.controller,
      serviceName: ELoggerDataOrder.serviceName,
      function: ELoggerDataOrder.function,
      message: ELoggerDataOrder.message,
      additionalArgs: ELoggerDataOrder.additionalArgs,
    };
  }

  public static getInstance(params: ILoggerClientMethods): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService(params);
    }

    return LoggingService.instance;
  }

  private formatter(data: ILoggerData): string {
    const orderAttribute = sortBy(Object.keys(data), key => this.loggerDataOrder[key as keyof typeof this.loggerDataOrder]);

    let finalMessage = orderAttribute.map(key => {
      if( data[key as keyof ILoggerData] instanceof Object) {
        data[key  as keyof ILoggerData] = JSON.stringify(data[key as keyof ILoggerData], null, 2)
      }
      return `${key}: ${data[key as keyof ILoggerData]}`;
    });

    return finalMessage.join('--->')
  }

  private getTracingId() {
    const tracingId = asyncContextStore.getTraceId();

    return tracingId;
  }

  public info(message: ILoggerData | string): void {
    const tracingId = this.getTracingId();
    let formmatedMessage: string = tracingId ? `tracingId: ${this.getTracingId()} --> `: '';

    if (typeof message !== 'string') {
      formmatedMessage += this.formatter(message);
    } else {
      formmatedMessage += message
    }

    this.loggerClient.info(formmatedMessage);
  }

  public notice(message: ILoggerData | string): void {
    const tracingId = this.getTracingId();
    let formmatedMessage: string = tracingId ? `tracingId: ${this.getTracingId()} --> `: '';

    if (typeof message !== 'string') {
      formmatedMessage += this.formatter(message);
    } else {
      formmatedMessage += message
    }

    this.loggerClient.notice(formmatedMessage);
  }

  public debug(message: ILoggerData | string): void {
    const tracingId = this.getTracingId();
    let formmatedMessage: string = tracingId ? `tracingId: ${this.getTracingId()} --> `: '';

    if (typeof message !== 'string') {
      formmatedMessage += this.formatter(message);
    } else {
      formmatedMessage += message
    }

    this.loggerClient.debug(formmatedMessage);
  }

  public warn(message: ILoggerData | string | null, option?: { error?: any; }): void {
    const tracingId = this.getTracingId();
    let formmatedMessage: string = tracingId ? `tracingId: ${this.getTracingId()} --> `: '';


    if (message !== null) {
      if (typeof message !== 'string') {
        formmatedMessage += this.formatter(message);
      } else {
        formmatedMessage += message
      }
    }

    this.loggerClient.warn(formmatedMessage, option?.error);
  }

  public error(message: ILoggerData | string | null, option?: { error?: any; }): void {
    const tracingId = this.getTracingId();
    let formmatedMessage: string = tracingId ? `tracingId: ${this.getTracingId()} --> `: '';

    if (message !== null) {
      if (typeof message !== 'string') {
        formmatedMessage += this.formatter(message);
      } else {
        formmatedMessage = message
      }
    }

    this.loggerClient.error(formmatedMessage, option?.error);
  }

  public alert(message: ILoggerData | string | null, option?: { error?: any; }): void {
    const tracingId = this.getTracingId();
    let formmatedMessage: string = tracingId ? `tracingId: ${this.getTracingId()} --> `: '';

    if (message !== null) {
      if (typeof message !== 'string') {
        formmatedMessage += this.formatter(message);
      } else {
        formmatedMessage = message
      }
    }

    this.loggerClient.alert(formmatedMessage, option?.error);
  }

}

export default LoggingService.getInstance(winstonService)