import { Global, Module } from '@nestjs/common';
import { LoggingService } from './logger.service';
import { WinstonService } from './winston/winston.service';

@Global()
@Module({
  providers: [LoggingService, WinstonService],
  exports: [LoggingService],
})
export class LoggerModule {}
