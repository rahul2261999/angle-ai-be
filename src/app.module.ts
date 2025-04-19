import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantModule } from './services/tenant/tenant.module';
import { ConfigurationModule } from './core/configuration/configuration.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigurationService } from './core/configuration/configuration.service';
import { LoggerModule } from './lib/logger/logger.module';
import { AlsModule } from './core/common/als/als.module';
import { HealthModule } from './services/health/health.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
