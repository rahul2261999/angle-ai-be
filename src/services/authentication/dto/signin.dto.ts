import { IsString, IsNotEmpty, IsEmail } from "class-validator";


export class SigninDto {
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @IsEmail({}, { message: 'Username must be a valid email' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
