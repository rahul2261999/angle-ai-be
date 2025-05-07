import { Injectable } from "@nestjs/common";
import { User, UserDocument } from "./schema/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "src/core/repository/base.repository";
import { Model } from "mongoose";
import { LoggingService } from "src/lib/logger/logger.service";
import { ILoggerData } from "src/lib/logger/logger.type";
import InternalServer from "src/core/error/internal-server.error";

@Injectable()
export class UserRepository extends BaseRepository<User, UserDocument> {
  constructor(
    @InjectModel(User.name) readonly userModel: Model<UserDocument>,
    readonly loggerService: LoggingService,
  ) {
    super(userModel, loggerService);  
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
   const loggerData: ILoggerData = {
    serviceName: 'UserRepository',
    function: 'findByUsername',
    message: `executing`,
   }

   try {
    this.loggerService.info(loggerData);
    
    const user = await this.userModel.findOne({ username });

    this.loggerService.info({
      ...loggerData,
      message: `execution completed`,
      additionalArgs: { user },
    });
    return user;
   } catch (error) {
    this.loggerService.error({
      ...loggerData,
      message: `execution failed`,
      additionalArgs: { error },
    });

    throw new InternalServer('Something went wrong while fetching user by username');
   }
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    const loggerData: ILoggerData = {
      serviceName: 'UserRepository',
      function: 'findByEmail',
      message: `executing`,
    }

    try {
      this.loggerService.info(loggerData);

      const user = await this.userModel.findOne({ email });

      this.loggerService.info({
        ...loggerData,
        message: `execution completed`,
        additionalArgs: { user },
      });

      return user;
    } catch (error) {
      this.loggerService.error({
        ...loggerData,
        message: `execution failed`,
        additionalArgs: { error },
      });

      throw new InternalServer('Something went wrong while fetching user by email');
    }
  }

  async findByTenantIdAndUserId(tenantId: string, userId: string): Promise<UserDocument | null> {
    const loggerData: ILoggerData = {
      serviceName: 'UserRepository',
      function: 'findByTenantIdAndUserId',
      message: `executing`,
    }

    try {
      this.loggerService.info(loggerData);

      const user = await this.userModel.findOne({ tenantId, userId });

      this.loggerService.info({
        ...loggerData,
        message: `execution completed`,
        additionalArgs: { user },
        });

      return user;
    } catch (error) {
      this.loggerService.error({
        ...loggerData,
      message: `execution failed`,
      additionalArgs: { error },
    });

      throw new InternalServer('Something went wrong while fetching user by tenantId and userId');
    }
  }
}
