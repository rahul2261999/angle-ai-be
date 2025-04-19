export interface ILoggerServiceMethods {
  error(data: ILoggerData, option?: { error?: any }): void;
  alert(data: ILoggerData, option?: { error: any }): void;
  warn(data: ILoggerData, option?: { error?: any }): void;
  info(data: ILoggerData): void;
  notice(data: ILoggerData): void;
  debug(data: ILoggerData): void;
}

export interface ILoggerClientMethods {
  error(...args: any[]): void;
  alert(...args: any[]): void;
  warn(...args: any[]): void;
  info(...args: any[]): void;
  notice(...args: any[]): void;
  debug(...args: any[]): void;
}

export interface ILoggerData {
  controller?: string;
  serviceName?: string;
  function?: string;
  message?: string;
  additionalArgs?: any;
}
