import { Controller, Get } from '@nestjs/common';
import { LoggingService } from 'src/lib/logger/logger.service';

@Controller({
  path: 'health',
})
export class HealthController {
  constructor(private readonly loggerService: LoggingService) {}

  @Get()
  public healthCheck() {
    this.loggerService.info('server health is good');

    return { status: 'UP' };
  }
}
