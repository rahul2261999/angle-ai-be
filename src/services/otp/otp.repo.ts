import { Model } from "mongoose";
import { Otp, OtpDocument } from "./schema/otp.schema";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "src/core/repository/base.repository";
import { LoggingService } from "src/lib/logger/logger.service";
import { ILoggerData } from "src/lib/logger/logger.type";
import InternalServer from "src/core/error/internal-server.error";
import { Injectable } from "@nestjs/common";
import { QueryOptions } from "src/core/repository/base.repository";
@Injectable()
export class OtpRepo extends BaseRepository<Otp, OtpDocument> {
  constructor(
    @InjectModel(Otp.name)
    readonly otpModel: Model<OtpDocument>,
    readonly loggerService: LoggingService,
  ) {
    super(otpModel, loggerService);
  }

  async findByEmail(email: string) {
    const loggerData: ILoggerData = {
      serviceName: 'OtpRepo',
      function: 'findByEmail',
      message: `executing`,
    }

    try {
      this.loggerService.info(loggerData);

      const otp = await this.otpModel.findOne({ email });

      this.loggerService.info({
        ...loggerData,
        message: 'OTP found',
      });

      return otp;
    } catch (error) {
      this.loggerService.error({
        ...loggerData,
        message: `execution failed`,
      });

      throw new InternalServer('Something went wrong while fetching OTP by email');
    }
  }

  async upsertOtp(data: Otp) {
    const loggerData: ILoggerData = {
      serviceName: 'OtpRepo',
      function: 'upsertOtp',
      message: `executing`,
    }

    try {
      this.loggerService.info(loggerData);

      const otp = await this.otpModel.findOneAndUpdate({ email: data.email }, data, { new: true, upsert: true });

      this.loggerService.info({
        ...loggerData,
        message: 'OTP upserted',
      });
      
      return otp;
    } catch (error) {
      this.loggerService.error({
        ...loggerData,  
        message: `execution failed`,
      });

      throw new InternalServer('Something went wrong while generating OTP');
    }
  } 
}
