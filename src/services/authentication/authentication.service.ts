import { Injectable } from '@nestjs/common';
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
import { IJwtPayload } from './authentication.types';
@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly tenantService: TenantService,
    private readonly loggerService: LoggingService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const loggerData: ILoggerData = {
      serviceName: 'SignupService',
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
      serviceName: 'SigninService',
      function: 'signin',
      message: 'Signing in a user',
    }

    try {
      this.loggerService.info(loggerData);

      const user = await this.userService.getUserByEmail(signinDto.email, { select: ['+password'] });

      if (!user) {
        throw new BadRequest('User not found');
      }

      if(user.status !== UserStatus.ACTIVE) {
        throw new BadRequest(`User is curreently ${user.status}`);
      }

      const isPasswordValid = await user.validatePassword(signinDto.password);

      if(!isPasswordValid) {
        throw new BadRequest('Please enter correct password');
      }

      const jwtPayload: IJwtPayload = {
        tenantId: user.tenantId,
        userId: user.id,
        email: user.email,
      }

      const token = await this.jwtService.signAsync(jwtPayload);
      
      return {
        token,
        user,
      }
      
    } catch (error) {
      this.loggerService.error(loggerData);

      throw error;
    }
  }
}
