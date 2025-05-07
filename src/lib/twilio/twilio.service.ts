import { Injectable } from '@nestjs/common';
import { LoggingService } from '../logger/logger.service';
import { Twilio } from 'twilio';
import { SendMessagePayload } from './twilio.types';
import { ILoggerData } from '../logger/logger.type';
import InternalServer from 'src/core/error/internal-server.error';

export class TwilioService {
  private readonly twilioClient: Twilio

  constructor(sid: string, token: string, private readonly loggerService: LoggingService) {
    this.twilioClient = new Twilio(sid, token)
  }

  public async sendMessage(params: SendMessagePayload) {
    const loggerData: ILoggerData = {
      serviceName: 'TwilioService',
      function: 'sendMessage',
      message: 'executing'
    }

    try {
      this.loggerService.info(loggerData);

      const response = await this.twilioClient.messages.create({
        to: params.recipient,
        from: params.sender,
        body: params.message,
        statusCallback: params.statusCallback
      });

      this.loggerService.info({ ...loggerData, message: 'executed' })
      
      return response.toJSON()
    } catch (error) {
      this.loggerService.error({ ...loggerData, message: 'failed to execute' }, { error });

      throw new InternalServer('Something went wrong')
    }
  }

}
