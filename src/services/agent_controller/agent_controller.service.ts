import { Injectable } from '@nestjs/common';
import { LoggingService } from 'src/lib/logger/logger.service';
import { AnswerDto } from './dto/answer.dto';
import { ILoggerData } from 'src/lib/logger/logger.type';
import { RagService } from '../agents/rag/rag.service';
import { AnswerSmsDto } from './dto/answer-sms.dto';

@Injectable()
export class AgentControllerService {
  constructor(
    private readonly loggerService: LoggingService,
    private readonly ragService: RagService,
  ) { }

  public async answer(answerDto: AnswerDto) {
    const loggerData: ILoggerData = {
      serviceName: 'AgentControllerService',
      function: 'answer',
    };

    try {
      this.loggerService.info(loggerData);

      const result = await this.ragService.runFlow(
        answerDto.question,
        {
          tenantId: answerDto.tenantId,
          knowledgebaseId: answerDto.knowledgebaseId,
        },
        answerDto.responseSchema || 'string'
      );

      this.loggerService.info({ ...loggerData, message: 'success' });

      return result;
    } catch (error) {
      this.loggerService.error({ ...loggerData, message: 'failed' });

      throw error;
    }
  }

  public async answerSms(answerSmsDto: AnswerSmsDto) {
    const loggerData: ILoggerData = {
      serviceName: 'AgentControllerService',
      function: 'answerSms',
    };

    try {
      this.loggerService.info(loggerData);

      // const result = await this.ragService.runFlow(
      //   answerSmsDto.body,
      //   {
      //     tenantId: answerSmsDto.tenantId,
      //     knowledgebaseId: answerSmsDto.knowledgebaseId,
      //   },
      //   answerSmsDto.responseSchema || 'string'
      // );

      this.loggerService.info({ ...loggerData, message: 'success' });

      // return result;
    } catch (error) {
      this.loggerService.error({ ...loggerData, message: 'failed' });

      throw error;
    }
  }
}
