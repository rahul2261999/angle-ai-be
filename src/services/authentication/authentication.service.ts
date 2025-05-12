import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { TenantService } from '../tenant/tenant.service';
import { LoggingService } from 'src/lib/logger/logger.service';
import { SignupDto } from './dto/signup.dto';
import { ILoggerData } from 'src/lib/logger/logger.type';
import { User } from '../user/schema/user.schema';
import { UserStatus, VerificationStatus } from '../user/user.type';
import BadRequest from 'src/core/error/bad-request';
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { UserJwt } from './authentication.types';
import { ConfigurationService } from 'src/core/configuration/configuration.service';
import { OtpService } from '../otp/otp.service';
import mongoose from 'mongoose';
import { EMAIL_PROVIDER, EmailOptions } from 'src/lib/email_provider/email_provider.type';
import { EmailProvider } from 'src/lib/email_provider/email_provider.type';
@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly tenantService: TenantService,
    private readonly loggerService: LoggingService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly configurationService: ConfigurationService,
    @Inject(EMAIL_PROVIDER) private readonly emailProvider: EmailProvider,
  ) { }

  async signup(signupDto: SignupDto) {
    const loggerData: ILoggerData = {
      serviceName: 'AuthenticationService',
      function: 'signup',
      message: 'Signing up a new user',
    }

    try {
      this.loggerService.info(loggerData);

      const createdTenant = await this.tenantService.create({
        name: 'Default'
      });

      if (signupDto.password !== signupDto.confirmPassword) {
        throw new BadRequest('Password and confirm password do not match');
      }

      const createUser: User = {
        tenantId: createdTenant.id,
        email: signupDto.email,
        password: signupDto.password,
        status: UserStatus.ACTIVE,
        verificationStatus: VerificationStatus.UNVERIFIED,
        createdBy: '1',
        updatedBy: '1'
      }

      const createdUser = await this.userService.internalCreate(createUser);

      this.loggerService.info(loggerData);

      return createdUser;
    } catch (error) {
      this.loggerService.error(loggerData);

      throw error;
    }
  }

  async signin(signinDto: SigninDto) {
    const loggerData: ILoggerData = {
      serviceName: 'AuthenticationService',
      function: 'signin',
      message: 'Signing in a user',
    }

    try {
      this.loggerService.info(loggerData);

      const user = await this.userService.getUserByEmail(signinDto.email, { select: ['+password'] });

      if (!user) {
        throw new BadRequest('User not found');
      }

      if (user.status !== UserStatus.ACTIVE) {
        throw new BadRequest(`User is curreently ${user.status}`);
      }

      const isPasswordValid = await user.validatePassword(signinDto.password);

      if (!isPasswordValid) {
        throw new BadRequest('Please enter correct password');
      }

      const otp = await this.otpService.generateOtp(user.email);

      const emailOptions: EmailOptions = {
        to: {
          email: user.email,
        },
        subject: 'OTP for login',
        text: `Your OTP for login is ${otp.otp}`,
      }

      await this.emailProvider.sendEmail(emailOptions);
      this.loggerService.info({ ...loggerData, message: 'OTP sent to user email' });

      const jwtPayload: UserJwt = {
        tenantId: user.tenantId,
        userId: user.id,
        email: user.email,
      }

      const otpJwtConfig = this.configurationService.getOtpJwtConfig();
      const token = await this.jwtService.signAsync(jwtPayload, { secret: otpJwtConfig.secret, expiresIn: otpJwtConfig.expiresIn });

      return {
        token: `Bearer ${token}`,
        user,
      }

    } catch (error) {
      this.loggerService.error(loggerData);

      throw error;
    }
  }

  async resendOtp(email: string) {
    const loggerData: ILoggerData = {
      serviceName: 'AuthenticationService',
      function: 'resendOtp',
      message: 'Resending OTP to user',
    }

    try {
      this.loggerService.info(loggerData);

      const user = await this.userService.getUserByEmail(email);

      if (!user) {
        throw new BadRequest('User not found');
      }

      if (user.status !== UserStatus.ACTIVE) {
        throw new BadRequest(`User is curreently ${user.status}`);
      }

      const otp = await this.otpService.generateOtp(user.email);

      const emailOptions: EmailOptions = {
        to: {
          email: user.email,
        },
        subject: 'OTP for login',
        text: `Your OTP for login is ${otp.otp}`,
      }

      await this.emailProvider.sendEmail(emailOptions);
      this.loggerService.info({ ...loggerData, message: 'OTP sent to user email' });

      const jwtPayload: UserJwt = {
        tenantId: user.tenantId,
        userId: user.id,
        email: user.email,
      }

      const otpJwtConfig = this.configurationService.getOtpJwtConfig();
      const token = await this.jwtService.signAsync(jwtPayload, { secret: otpJwtConfig.secret, expiresIn: otpJwtConfig.expiresIn });

      return {
        token: `Bearer ${token}`,
      }

    } catch (error) {
      this.loggerService.error(loggerData);

      throw error;
    }
  }

  async verifyOtp(otp: string, user: UserJwt) {
    const loggerData: ILoggerData = {
      serviceName: 'AuthenticationService',
      function: 'verifyOtp',
      message: 'Verifying OTP',
    }

    try {
      this.loggerService.info(loggerData);

      const validOtp = await this.otpService.validateOtp(user.email, otp);

      if (!validOtp) {
        throw new BadRequest('Oops! Wrong OTP');
      }

      await this.userService.internalUpdateUser(
        { verificationStatus: VerificationStatus.VERIFIED },
        { _id: new mongoose.Types.ObjectId(user.userId) }
      );

      await this.otpService.deleteOtp(user.email);

      this.loggerService.info({ ...loggerData, message: 'OTP verified successfully' });

      const authJwtConfig = this.configurationService.getAuthJwtConfig();

      const jwtPayload: UserJwt = {
        tenantId: user.tenantId,
        userId: user.userId,
        email: user.email,
      }

      const token = await this.jwtService.signAsync(jwtPayload, { secret: authJwtConfig.secret, expiresIn: authJwtConfig.expiresIn });

      return { token: `Bearer ${token}` };
    } catch (error) {
      this.loggerService.error(loggerData);

      throw error;
    }
  }
}
