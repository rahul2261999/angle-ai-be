import { IsNotEmpty, IsString } from 'class-validator';

export class AnswerDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @IsString()
  @IsNotEmpty()
  knowledgebaseId: string;
}
