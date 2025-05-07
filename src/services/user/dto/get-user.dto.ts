import { IsNotEmpty, IsString } from "class-validator";


export class GetUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}
