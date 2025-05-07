import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { AlsService } from './core/common/als/als.service';
import { GlobalExceptionFilter } from './core/error/global-error';
import { LoggingService } from './lib/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const loggerService = app.get(LoggingService);
  const alsService = app.get(AlsService);

  app.enableCors({
    origin: '*',
  });
  app.setGlobalPrefix('/main/api');

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter(loggerService, alsService));
  await app.listen(process.env.PORT ?? 8001, () => {
    loggerService.notice(`Server is running on port ${process.env.PORT ?? 8001}`);
  });
}

void bootstrap();
