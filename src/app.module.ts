import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantModule } from './services/tenant/tenant.module';
import { ConfigurationModule } from './core/configuration/configuration.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigurationService } from './core/configuration/configuration.service';
import { LoggerModule } from './lib/logger/logger.module';
import { AlsModule } from './core/common/als/als.module';
import { HealthModule } from './services/health/health.module';
import { ChatModelService } from './lib/chat_models/chat-modle.service';
import { AgentControllerModule } from './services/agent_controller/agent_controller.module';
import { ChatModelsModule } from './lib/chat_models/chat-models.module';
import { UserModule } from './services/user/user.module';
import { AuthenticationModule } from './services/authentication/authentication.module';
import { NextFunction } from 'express';
import { AlsService } from './core/common/als/als.service';
import { OtpModule } from './services/otp/otp.module';
import { EmailProviderService } from './lib/email_provider/email_provider.service';
import { EmailProviderModule } from './lib/email_provider/email_provider.module';

@Module({
  imports: [
    ConfigurationModule,
    MongooseModule.forRootAsync({
      useFactory: (configurationService: ConfigurationService) => ({
        uri: configurationService.getMongoUri(),
      }),
      inject: [ConfigurationService],
    }),
    LoggerModule,
    AlsModule,
    HealthModule,
    TenantModule,
    AgentControllerModule,
    ChatModelsModule,
    UserModule,
    AuthenticationModule,
    OtpModule,
    EmailProviderModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatModelService],
})
export class AppModule implements NestModule {
  constructor(private readonly alsService: AlsService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req: Request, _, next: NextFunction) => {
        const traceId = req.headers['x-trace-id'] as string | undefined;

        this.alsService.runContext(new Map(), () => {
          this.alsService.setTraceId(traceId);

          next();
        });
      })
      .forRoutes('*path');
  }
}