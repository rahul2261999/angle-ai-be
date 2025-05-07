import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SigninDto } from './dto/signin.dto';
import SuccessResponse from 'src/core/response/response.util';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { SignupDto } from './dto/signup.dto';
@Controller('authentication')
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
          token: data.token,
          user: userResponse,
        },
      }
    )
  }
}
