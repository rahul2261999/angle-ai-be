import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../core/repository/base.repository';
import { Tenant, TenantDocument } from './schema/tenant.schema';
import { LoggingService } from 'src/lib/logger/logger.service';

@Injectable()
export class TenantRepository extends BaseRepository<TenantDocument> {
  constructor(
    @InjectModel(Tenant.name)
    readonly tenantModel: Model<TenantDocument>,
    readonly loggerService: LoggingService,
  ) {
    super(tenantModel, loggerService);
  }
}
