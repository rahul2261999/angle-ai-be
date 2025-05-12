import { Injectable } from '@nestjs/common';
import { CreateEmailOptions, Resend } from 'resend';
import {
  EmailProvider,
  EmailOptions,
  BulkEmailOptions,
  EmailProviderConfig,
  EmailRecipient,
  EmailResponse,
} from './email_provider.type';
import { LoggingService } from 'src/lib/logger/logger.service';
import { ILoggerData } from '../logger/logger.type';
import InternalServer from 'src/core/error/internal-server.error';
@Injectable()
export class EmailProviderService implements EmailProvider {
  private readonly client: Resend;
  private readonly defaultFrom?: EmailRecipient;

  constructor(
    readonly config: EmailProviderConfig,
    private readonly loggerService: LoggingService,
  ) {
    this.client = new Resend(config.apiKey);
    this.defaultFrom = config.defaultFrom;
  }

  private formatEmailOptions(options: EmailOptions): CreateEmailOptions {
    const loggerData: ILoggerData = {
      serviceName: 'EmailProviderService',
      function: 'formatEmailOptions',
      message: 'Formatting email options',
    }
    
    this.loggerService.info(loggerData);

    const from = options.from || this.defaultFrom;
    if (!from) {
      throw new Error('Sender email is required');
    }

    const to = Array.isArray(options.to) ? options.to : [options.to];
    const cc = options.cc ? (Array.isArray(options.cc) ? options.cc : [options.cc]) : undefined;
    const bcc = options.bcc ? (Array.isArray(options.bcc) ? options.bcc : [options.bcc]) : undefined;

    const emailOptions: CreateEmailOptions = {
      from: `${from.name} <${from.email}>`,
      to: to.map(recipient => `${recipient.name ? `${recipient.name} ` : ''}${recipient.email}`),
      subject: options.subject,
      text: options.text || '',
      html: options.html,
      cc: cc?.map(recipient => `${recipient.name ? `${recipient.name} ` : ''}${recipient.email}`),
      bcc: bcc?.map(recipient => `${recipient.name ? `${recipient.name} ` : ''}${recipient.email}`),
      replyTo: options.replyTo?.email,
      attachments: options.attachments?.map(attachment => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
      tags: options.tags ? Object.entries(options.tags).map(([name, value]) => ({ name, value })) : undefined,
    }

    this.loggerService.info(loggerData);

    return emailOptions;
  }

  async sendEmail(options: EmailOptions): Promise<EmailResponse> {
    const loggerData: ILoggerData = {
      serviceName: 'EmailProviderService',
      function: 'sendEmail',
      message: 'Sending email',
    }

    try {
      this.loggerService.info(loggerData);
      
      const emailOptions = this.formatEmailOptions(options);
      const emailResponse = await this.client.emails.send(emailOptions);
      
      if(emailResponse.error) {
        throw new InternalServer(emailResponse.error.message);
      }

      this.loggerService.info({...loggerData, message: 'Email sent successfully'});

      return { id: emailResponse.data?.id };
    } catch (error) {
      this.loggerService.error({...loggerData, message: 'Error sending email'}, error);
      throw error;
    }
  }

  async sendBulkEmails(options: BulkEmailOptions): Promise<EmailResponse[]> {
    const loggerData: ILoggerData = {
      serviceName: 'EmailProviderService',
      function: 'sendBulkEmails',
      message: 'Sending bulk emails',
    }

    try {
      this.loggerService.info(loggerData);
      
      const emailOptions = options.map(option => this.formatEmailOptions(option));
      const batch = await this.client.batch.send(emailOptions);

      if(batch.error) {
        throw new InternalServer(batch.error.message);
      }

      if(batch.data && batch.data.data) {
        this.loggerService.info({...loggerData, message: 'Emails sent successfully'});

        return batch.data.data.map(response => ({ id: response.id }));
      }

      this.loggerService.info({...loggerData, message: 'No emails sent'});

      return [];
    } catch (error) {
      this.loggerService.error({...loggerData, message: 'Error sending bulk emails'}, error);
      
      throw error;
    }
  }
} 