import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repo';
import { LoggingService } from 'src/lib/logger/logger.service';
import { ILoggerData } from 'src/lib/logger/logger.type';
import { User } from './schema/user.schema';
import { TenantService } from '../tenant/tenant.service';
import { VerificationStatus } from './user.type';
import { UserStatus } from './user.type';
import BadRequest from 'src/core/error/bad-request';
import NotFound from 'src/core/error/not-found';
import { FilterQuery } from 'mongoose';
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly loggerService: LoggingService,
  ) { }

  async internalCreate(user: User) {
    const loggerData: ILoggerData = {
      serviceName: 'UserService',
      function: 'internalCreate',
      message: `executing`,
    }

    try {
      this.loggerService.info(loggerData);

      const createdUser = await this.userRepository.create(user);

      this.loggerService.info({
        ...loggerData,
        message: `execution completed`,
      });

      return createdUser;
    } catch (error) {
      this.loggerService.error({
        ...loggerData,
        message: `execution failed`,
        additionalArgs: { error },
      });

      throw error;
    }
  }

  async getUserByEmail(email: string, options?: { select?: string[] }) {
    const loggerData: ILoggerData = {
      serviceName: 'UserService',
      function: 'getUserByEmail',
      message: `executing`,
    }

    try {
      this.loggerService.info(loggerData);

      const user = await this.userRepository.findOne({ email }, { select: options?.select });

      if (!user) {
        throw new NotFound('User not found');
      }

      this.loggerService.info({
        ...loggerData,
        message: `execution completed`,
      });

      return user;
    } catch (error) {
      this.loggerService.error({
        ...loggerData,
        message: `execution failed`,
        additionalArgs: { error },
      });

      throw error;
    }
  }

  async getUserByUsername(username: string) {
    const loggerData: ILoggerData = {
      serviceName: 'UserService',
      function: 'getUserByUsername',
      message: `executing`,
    }

    try {
      this.loggerService.info(loggerData);

      const user = await this.userRepository.findOne({ username });

      if (!user) {
        throw new NotFound('User not found');
      }

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

      throw error;
    }
  }

  async internalUpdateUser(user: Partial<User>, filter: FilterQuery<User>) {
    const loggerData: ILoggerData = {
      serviceName: 'UserService',
      function: 'internalUpdateUser',
      message: `executing`,
    }

    try {
      this.loggerService.info(loggerData);

      const updatedUser = await this.userRepository.updateOne(filter, user);

      this.loggerService.info({
        ...loggerData,
        message: `execution completed`,
        additionalArgs: { updatedUser },
      });

    } catch (error) {
      this.loggerService.error({
        ...loggerData,
        message: `execution failed`,
        additionalArgs: { error },
      });

      throw error;
    }
  }

}
