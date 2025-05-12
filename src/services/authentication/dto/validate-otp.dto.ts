import { IsNotEmpty, IsString, max, MaxLength, MinLength } from "class-validator";

export class ValidateOtpDto {
  @IsString({ message: 'OTP must be a string' })
  @IsNotEmpty({ message: 'OTP is required' })
  @MinLength(6, { message: 'OTP must be 6 digits long' })
  @MaxLength(6, { message: 'OTP must be 6 digits long' })
  otp: string;
}
