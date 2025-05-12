import { Module } from '@nestjs/common';
import { EMAIL_PROVIDER } from './email_provider.type';
import { EmailProviderService } from './email_provider.service';
import { ConfigurationService } from 'src/core/configuration/configuration.service';
import { ConfigModule } from '@nestjs/config';
import { LoggingService } from '../logger/logger.service';
@Module({
  providers: [
    {
      provide: EMAIL_PROVIDER,
      useFactory: (configService: ConfigurationService, loggingService: LoggingService) => {
        const emailProviderConfig = configService.getEmailProviderConfig();
        
        return new EmailProviderService({
          apiKey: emailProviderConfig.apiKey,
          defaultFrom: {
            email: emailProviderConfig.defaultFrom,
            name: emailProviderConfig.defaultFromName,
          },
        },
        loggingService,
      );
      },
      inject: [ConfigurationService, LoggingService],
    },
  ],
  exports: [EMAIL_PROVIDER],
})
export class EmailProviderModule {}
