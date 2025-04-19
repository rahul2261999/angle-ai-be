/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import BaseError from './base.error';
import { LoggingService } from 'src/lib/logger/logger.service';
import InternalServer from './internal-server.error';
import { AlsService } from '../common/als/als.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly loggerService: LoggingService,
    private readonly alsServcie: AlsService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Log the exception
    this.loggerService.error('Exception caught by global filter', {
      error: exception as Error,
    });

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: any[] = [];
    const tracingId = this.alsServcie.getTraceId() || null;

    // Handle our custom errors
    if (exception instanceof BaseError) {
      const errorResponse = exception.toJson();
      statusCode = errorResponse.statusCode;
      message = errorResponse.message;
      errors = errorResponse.error || [];
    }
    // Handle NestJS HttpExceptions
    else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const responseBody = exception.getResponse();

      if (typeof responseBody === 'object') {
        message = (responseBody as any).message || message;

        if (Array.isArray((responseBody as any).message)) {
          errors = (responseBody as any).message;
          message = 'Validation failed';
        }
      } else {
        message = responseBody.toString();
      }
    }
    // Handle unexpected errors
    else if (exception instanceof Error) {
      this.loggerService.error(exception.message, { error: exception });

      const internalError = new InternalServer('something went wrong', {
        error: [exception],
      });
      const errorResponse = internalError.toJson();

      statusCode = errorResponse.statusCode;
      message = errorResponse.message;
      errors = errorResponse.error || [];
    }

    response.status(statusCode).json({
      tracingId,
      statusCode,
      message,
      error: errors.length ? errors : [],
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
