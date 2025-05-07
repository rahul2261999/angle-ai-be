import { IsNotEmpty, IsString } from "class-validator";

export class AnswerSmsParamsDto {
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @IsString()
  @IsNotEmpty()
  virtualAssistantId: string;
}