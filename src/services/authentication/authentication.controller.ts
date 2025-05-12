import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards  } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SigninDto } from './dto/signin.dto';
import SuccessResponse from 'src/core/response/response.util';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { SignupDto } from './dto/signup.dto';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { User } from 'src/core/decorators/user.decorator';
import { UserJwt } from './authentication.types';
import { AuthGuard } from './guard/otp-auth.guard';
@Controller({
  path: 'authentication',
  version: '1',
})
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) { }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    await this.authenticationService.signup(signupDto);

    return new SuccessResponse('User signed up successfully', { statusCode: HttpStatus.CREATED });
  }

  @Post('signin')
  async signin(@Body() signinDto: SigninDto) {
    const data = await this.authenticationService.signin(signinDto);

    const userResponse = plainToInstance(UserResponseDto, data.user, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponse(
      'User signed in successfully',
      {
        data: {
          otpToken: data.token,
          user: userResponse,
        },
      }
    )
  }

  @Post('verify')
  @UseGuards(AuthGuard)
  async verifyOtp(@Body() verifyOtpDto: ValidateOtpDto, @User() user: UserJwt) {
    
    const data = await this.authenticationService.verifyOtp(verifyOtpDto.otp, user);

    return new SuccessResponse('OTP verified successfully', { statusCode: HttpStatus.OK, data });
  }
}
