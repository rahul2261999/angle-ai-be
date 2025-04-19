/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  AnyBulkWriteOperation,
  Document,
  FilterQuery,
  Model,
  SortOrder,
  UpdateQuery,
} from 'mongoose';
import { ILoggerData } from 'src/lib/logger/logger.type';
import InternalServer from '../error/internal-server.error';
import { LoggingService } from 'src/lib/logger/logger.service';

export interface QueryOptions<T> {
  sort?: { [key in keyof T]?: SortOrder };
  skip?: number;
  limit?: number;
  select?: string | Record<string, number | boolean | object>;
}

export interface IBaseRepository<T extends Document> {
  create(data: Partial<T>): Promise<T>;
  findOne(filter: FilterQuery<T>, projection?: any): Promise<T | null>;
  findMany(
    filter: FilterQuery<T>,
    options?: QueryOptions<T>,
    projection?: any,
  ): Promise<T[]>;
  updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<T | null>;
  updateMany(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<boolean>;
  deleteOne(filter: FilterQuery<T>): Promise<boolean>;
  deleteMany(filter: FilterQuery<T>): Promise<boolean>;
  bulkCreate(data: Partial<T>[]): Promise<T[]>;
  bulkUpdate(
    updates: Array<{ filter: FilterQuery<T>; update: UpdateQuery<T> }>,
  ): Promise<boolean>;
}

export abstract class BaseRepository<T extends Document>
  implements IBaseRepository<T>
{
  constructor(
    protected readonly model: Model<T>,
    protected readonly loggerService: LoggingService,
  ) {}

  async create(data: Partial<T>): Promise<T> {
    const loggerData: ILoggerData = {
      serviceName: this.constructor.name,
      function: 'create',
      message: 'executing',
    };

    try {
      this.loggerService.info(loggerData);
      const entity = new this.model(data);
      const result = await entity.save();
      this.loggerService.info({ ...loggerData, message: 'executed' });
      return result;
    } catch (error) {
      this.loggerService.error({ ...loggerData, message: 'failed' }, { error });
      throw new InternalServer('something went wrong');
    }
  }

  async findOne(filter: FilterQuery<T>, projection?: any): Promise<T | null> {
    const loggerData: ILoggerData = {
      serviceName: this.constructor.name,
      function: 'findOne',
      message: 'executing',
    };

    try {
      this.loggerService.info(loggerData);
      const result = await this.model.findOne(filter, projection).exec();
      this.loggerService.info({ ...loggerData, message: 'executed' });
      return result;
    } catch (error) {
      this.loggerService.error({ ...loggerData, message: 'failed' }, { error });
      throw new InternalServer('something went wrong');
    }
  }

  async findMany(
    filter: FilterQuery<T>,
    options?: QueryOptions<T>,
    projection?: any,
  ): Promise<T[]> {
    const loggerData: ILoggerData = {
      serviceName: this.constructor.name,
      function: 'findMany',
      message: 'executing',
    };

    try {
      this.loggerService.info(loggerData);
      const query = this.model.find(filter, projection);

      if (options) {
        if (options.skip !== undefined) {
          query.skip(options.skip);
        }

        if (options.limit !== undefined) {
          query.limit(options.limit);
        }

        if (options.sort) {
          query.sort(options.sort as any);
        }

        if (options.select) {
          query.select(options.select);
        }
      }

      const result = await query.exec();
      this.loggerService.info({ ...loggerData, message: 'executed' });
      return result;
    } catch (error) {
      this.loggerService.error({ ...loggerData, message: 'failed' }, { error });
      throw new InternalServer('something went wrong');
    }
  }

  async updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
  ): Promise<T | null> {
    const loggerData: ILoggerData = {
      serviceName: this.constructor.name,
      function: 'updateOne',
      message: 'executing',
    };

    try {
      this.loggerService.info(loggerData);
      const result = await this.model
        .findOneAndUpdate(filter, update, { new: true })
        .exec();
      this.loggerService.info({ ...loggerData, message: 'executed' });
      return result;
    } catch (error) {
      this.loggerService.error({ ...loggerData, message: 'failed' }, { error });
      throw new InternalServer('something went wrong');
    }
  }

  async updateMany(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
  ): Promise<boolean> {
    const loggerData: ILoggerData = {
      serviceName: this.constructor.name,
      function: 'updateMany',
      message: 'executing',
    };

    try {
      this.loggerService.info(loggerData);
      const result = await this.model.updateMany(filter, update).exec();
      this.loggerService.info({ ...loggerData, message: 'executed' });
      return result.modifiedCount > 0;
    } catch (error) {
      this.loggerService.error({ ...loggerData, message: 'failed' }, { error });
      throw new InternalServer('something went wrong');
    }
  }

  async deleteOne(filter: FilterQuery<T>): Promise<boolean> {
    const loggerData: ILoggerData = {
      serviceName: this.constructor.name,
      function: 'deleteOne',
      message: 'executing',
    };

    try {
      this.loggerService.info(loggerData);
      const result = await this.model.deleteOne(filter).exec();
      this.loggerService.info({ ...loggerData, message: 'executed' });
      return result.deletedCount === 1;
    } catch (error) {
      this.loggerService.error({ ...loggerData, message: 'failed' }, { error });
      throw new InternalServer('something went wrong');
    }
  }

  async deleteMany(filter: FilterQuery<T>): Promise<boolean> {
    const loggerData: ILoggerData = {
      serviceName: this.constructor.name,
      function: 'deleteMany',
      message: 'executing',
    };

    try {
      this.loggerService.info(loggerData);
      const result = await this.model.deleteMany(filter).exec();
      this.loggerService.info({ ...loggerData, message: 'executed' });
      return result.deletedCount > 0;
    } catch (error) {
      this.loggerService.error({ ...loggerData, message: 'failed' }, { error });
      throw new InternalServer('something went wrong');
    }
  }

  async bulkCreate(data: Partial<T>[]): Promise<T[]> {
    const loggerData: ILoggerData = {
      serviceName: this.constructor.name,
      function: 'bulkCreate',
      message: 'executing',
    };

    try {
      this.loggerService.info(loggerData);
      const result = await this.model.insertMany(data);
      this.loggerService.info({ ...loggerData, message: 'executed' });
      return result as unknown as T[];
    } catch (error) {
      this.loggerService.error({ ...loggerData, message: 'failed' }, { error });
      throw new InternalServer('something went wrong');
    }
  }

  async bulkUpdate(
    updates: Array<{ filter: FilterQuery<T>; update: UpdateQuery<T> }>,
  ): Promise<boolean> {
    const loggerData: ILoggerData = {
      serviceName: this.constructor.name,
      function: 'bulkUpdate',
      message: 'executing',
    };

    try {
      this.loggerService.info(loggerData);
      const bulkOps: AnyBulkWriteOperation<T>[] = updates.map(
        ({ filter, update }) => ({
          updateOne: {
            filter,
            update,
            upsert: false,
          },
        }),
      );

      const result = await this.model.bulkWrite(
        bulkOps as unknown as AnyBulkWriteOperation<any>[],
      );
      this.loggerService.info({ ...loggerData, message: 'executed' });
      return result.modifiedCount > 0;
    } catch (error) {
      this.loggerService.error({ ...loggerData, message: 'failed' }, { error });
      throw new InternalServer('something went wrong');
    }
  }

  public async bulkWrite(params: AnyBulkWriteOperation<T>[]) {
    const loggerData: ILoggerData = {
      serviceName: this.constructor.name,
      function: 'bulkWrite',
      message: 'executing',
    };

    try {
      this.loggerService.info(loggerData);
      const data = await this.model.bulkWrite(params as any);
      this.loggerService.info({ ...loggerData, message: 'executed' });
      return data;
    } catch (error) {
      this.loggerService.error({ ...loggerData, message: 'failed' }, { error });
      throw new InternalServer('something went wrong');
    }
  }
}
