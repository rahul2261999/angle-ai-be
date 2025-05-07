import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class AnswerSmsDto {
  @Transform(({ obj }) => obj.MessageSid)
  @IsString()
  @IsNotEmpty()
  messageSid: string;

  @Transform(({ obj }) => obj.AccountSid)
  @IsString()
  @IsNotEmpty()
  accountSid: string;

  @Transform(({ obj }) => obj.MessagingServiceSid)
  @IsString()
  @IsNotEmpty()
  messagingServiceSid: string;

  @Transform(({ obj }) => obj.From)
  @IsString()
  @IsNotEmpty()
  from: string;

  @Transform(({ obj }) => obj.To)
  @IsString()
  @IsNotEmpty()
  to: string;

  @Transform(({ obj }) => obj.Body)
  @IsString()
  @IsNotEmpty()
  body: string;

  @Transform(({ obj }) => obj.ApiVersion)
  @IsString()
  @IsNotEmpty()
  apiVersion: string;
}