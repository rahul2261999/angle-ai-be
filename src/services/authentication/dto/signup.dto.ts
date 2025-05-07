import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class SignupDto {
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword({}, { message: 'Password must be a strong password' })
  password: string;

  @IsString({ message: 'Confirm password must be a string' })
  @IsNotEmpty({ message: 'Confirm password is required' })
  @IsStrongPassword({}, { message: 'Confirm password must be a strong password' })
  confirmPassword: string;
}
