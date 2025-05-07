import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { TenantModule } from '../tenant/tenant.module';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigurationModule } from '../../core/configuration/configuration.module';
import { ConfigurationService } from '../../core/configuration/configuration.service';

@Module({
  imports: [
    UserModule, 
    TenantModule,
    ConfigurationModule,
    JwtModule.registerAsync({
      imports: [ConfigurationModule],
      useFactory: async (configService: ConfigurationService) => ({
        global: true,
        secret: configService.getAuthJwtConfig().secret,
        signOptions: { expiresIn: configService.getAuthJwtConfig().expiresIn },
      }),
      inject: [ConfigurationService],
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
