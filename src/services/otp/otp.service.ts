import { Injectable } from '@nestjs/common';
import { LoggingService } from 'src/lib/logger/logger.service';
import { ILoggerData } from 'src/lib/logger/logger.type';
import { OtpRepo } from './otp.repo';
import BadRequest from 'src/core/error/bad-request';
import InternalServer from 'src/core/error/internal-server.error';
@Injectable()
export class OtpService {
  constructor(
    private readonly loggerService: LoggingService,
    private readonly otpRepo: OtpRepo,
  ) { }

  async validateOtp(email: string, inputOtp: string) {
    const loggerData: ILoggerData = {
      serviceName: 'OtpService',
      function: 'validateOtp',
      message: 'Validating OTP',
    }

    try {
      this.loggerService.info(loggerData);

      const otpRecord = await this.otpRepo.findByEmail(email);

      if (!otpRecord) {
        return false;
      }

      if (otpRecord.otp !== inputOtp) {
        return false;
      }

      if (otpRecord.expiresAt < new Date()) {
        return false;
      }

      return true;
    } catch (error) {
      this.loggerService.error(loggerData);

      throw error;
    }

  }

  async generateOtp(email: string) {
    const loggerData: ILoggerData = {
      serviceName: 'OtpService',
      function: 'generateOtp',
      message: 'Generating OTP',
    }

    try {
      this.loggerService.info(loggerData);

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 5);

      const getOtpRecord = await this.otpRepo.findByEmail(email);

      const otpRecord = await this.otpRepo.upsertOtp({ 
        email, 
        otp, 
        expiresAt,
        count: getOtpRecord?.count || 0,
        lastSentAt: new Date(),
      });

      return otpRecord;
    } catch (error) {
      this.loggerService.error({ ...loggerData, message: 'error generating otp' });

      throw new InternalServer('Not able to generate otp at this moment');
    }
  }

  async deleteOtp(email: string) {
    const loggerData: ILoggerData = {
      serviceName: 'OtpService',
      function: 'deleteOtp',
      message: 'Deleting OTP',
    }

    try {
      this.loggerService.info(loggerData);

      await this.otpRepo.deleteOne({ email });

      this.loggerService.info({ ...loggerData, message: 'OTP deleted successfully' });

      return true;
    } catch (error) {
      this.loggerService.error(loggerData);

      throw error;
    }
  }   
}
