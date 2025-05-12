import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { TenantModule } from '../tenant/tenant.module';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigurationModule } from '../../core/configuration/configuration.module';
import { OtpModule } from '../otp/otp.module';
import { AuthGuard } from './guard/otp-auth.guard';
import { EmailProviderModule } from 'src/lib/email_provider/email_provider.module';
@Module({
  imports: [
    UserModule, 
    TenantModule,
    ConfigurationModule,
    JwtModule.register({ global: true }),
    OtpModule,
    EmailProviderModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, AuthGuard],
})
export class AuthenticationModule {}
