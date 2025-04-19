import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AlsService } from './als/als.service';
import { Response } from 'express';

@Injectable()
export class TracingInterceptor implements NestInterceptor {
  constructor(private readonly alsService: AlsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse<Response>();

    // Get the trace ID from the request context
    const tracingId = this.alsService.getTraceId();

    // Set the tracing ID in the response headers (only for HTTP requests)
    if (response && tracingId) {
      response.setHeader('x-trace-id', tracingId);
    }

    return next.handle();
  }
}
