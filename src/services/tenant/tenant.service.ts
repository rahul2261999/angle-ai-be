import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantRepository } from './tenant.repository';
import { TenantDocument } from './schema/tenant.schema';
import { Status } from 'src/core/constants/global.enum';
import * as crypto from 'crypto';
import { generateTenantId } from 'src/utils/helper';
import { LoggingService } from 'src/lib/logger/logger.service';
import { Types } from 'mongoose';
import { ILoggerData } from 'src/lib/logger/logger.type';

@Injectable()
export class TenantService {
  constructor(
    private readonly loggerService: LoggingService,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async create(createTenantDto: CreateTenantDto): Promise<TenantDocument> {
    const loggerData: ILoggerData = {
      serviceName: 'TenantService',
      function: 'create',
      message: 'executing',
    };

    try {
      this.loggerService.info(loggerData);

      const tenantId: string = generateTenantId();
      const authKey = crypto.randomBytes(32).toString('hex');

      const tenant = await this.tenantRepository.create({
        name: createTenantDto.name,
        tenantId,
        authKey,
        status: Status.ACTIVE,
        createdBy: 1, 
        updatedBy: 1,
      });

      this.loggerService.info({
        ...loggerData,
        message: 'execution completed',
        additionalArgs: { tenantId: (tenant._id as Types.ObjectId).toString() },
      });

      return tenant;
    } catch (error: any) {
      this.loggerService.error({
        ...loggerData,
        message: 'failed',
        additionalArgs: { error: error.message },
      });
      throw error;
    }
  }

  async findAll(): Promise<TenantDocument[]> {
    const loggerData: ILoggerData = {
      serviceName: 'TenantService',
      function: 'findAll',
      message: 'executing',
    };

    try {
      this.loggerService.info(loggerData);
      const tenants = await this.tenantRepository.findMany({});

      this.loggerService.info({
        ...loggerData,
        message: 'execution completed',
        additionalArgs: { count: tenants.length },
      });

      return tenants;
    } catch (error: any) {
      this.loggerService.error({
        ...loggerData,
        message: 'failed',
        additionalArgs: { error: error.message },
      });
      throw error;
    }
  }

  async findOne(id: string): Promise<TenantDocument> {
    const loggerData: ILoggerData = {
      serviceName: 'TenantService',
      function: 'findOne',
      message: 'executing',
    };

    try {
      this.loggerService.info(loggerData);
      const tenant = await this.tenantRepository.findOne({ _id: id });

      if (!tenant) {
        this.loggerService.warn({
          ...loggerData,
          message: 'tenant not found',
          additionalArgs: { tenantId: id },
        });
        throw new NotFoundException(`Tenant with ID ${id} not found`);
      }

      this.loggerService.info({
        ...loggerData,
        message: 'execution completed',
        additionalArgs: { tenantId: id },
      });

      return tenant;
    } catch (error: any) {
      this.loggerService.error({
        ...loggerData,
        message: 'failed',
        additionalArgs: { error: error.message, tenantId: id },
      });
      throw error;
    }
  }

  async update(
    id: string,
    updateTenantDto: UpdateTenantDto,
  ): Promise<TenantDocument> {
    const loggerData: ILoggerData = {
      serviceName: 'TenantService',
      function: 'update',
      message: 'executing',
    };

    try {
      this.loggerService.info(loggerData);

      const updateData: any = {
        updatedBy: 1, // TODO: Get from auth context
      };

      if (updateTenantDto.name) {
        updateData.name = updateTenantDto.name;
      }

      const updatedTenant = await this.tenantRepository.updateOne(
        { _id: id },
        { $set: updateData },
      );

      if (!updatedTenant) {
        this.loggerService.warn({
          ...loggerData,
          message: 'tenant not found',
          additionalArgs: { tenantId: id },
        });
        throw new NotFoundException(`Tenant with ID ${id} not found`);
      }

      this.loggerService.info({
        ...loggerData,
        message: 'execution completed',
        additionalArgs: { tenantId: id, updateData },
      });

      return updatedTenant;
    } catch (error: any) {
      this.loggerService.error({
        ...loggerData,
        message: 'failed',
        additionalArgs: { error: error.message, tenantId: id },
      });
      throw error;
    }
  }

  async remove(id: string): Promise<boolean> {
    const loggerData: ILoggerData = {
      serviceName: 'TenantService',
      function: 'remove',
      message: 'executing',
    };

    try {
      this.loggerService.info(loggerData);
      const result = await this.tenantRepository.deleteOne({ _id: id });

      if (!result) {
        this.loggerService.warn({
          ...loggerData,
          message: 'tenant not found',
          additionalArgs: { tenantId: id },
        });
        throw new NotFoundException(`Tenant with ID ${id} not found`);
      }

      this.loggerService.info({
        ...loggerData,
        message: 'execution completed',
        additionalArgs: { tenantId: id },
      });

      return result;
    } catch (error: any) {
      this.loggerService.error({
        ...loggerData,
        message: 'failed',
        additionalArgs: { error: error.message, tenantId: id },
      });
      throw error;
    }
  }
}
