/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  AnyBulkWriteOperation,
  Document,
  FilterQuery,
  Model,
  SortOrder,
  UpdateQuery,
  PopulateOptions,
  QueryOptions as MongooseQueryOptions,
  ClientSession,
} from 'mongoose';
import { ILoggerData } from 'src/lib/logger/logger.type';
import InternalServer from '../error/internal-server.error';
import { LoggingService } from 'src/lib/logger/logger.service';

export interface QueryOptions<T> {
  sort?: { [key in keyof T]?: SortOrder };
  skip?: number;
  limit?: number;
  select?: string | string[] | Record<string, number | boolean | object>;
  populate?: PopulateOptions | PopulateOptions[];
  lean?: boolean;
  new?: boolean;
  upsert?: boolean;
  runValidators?: boolean;
  setDefaultsOnInsert?: boolean;
  timestamps?: boolean;
  projection?: Record<string, number | boolean | object>;
  session?: ClientSession;
}

export interface IBaseRepository<C, T extends Document> {
  create(data: C, options?: QueryOptions<T>): Promise<T>;
  findOne(filter: FilterQuery<T>, options?: QueryOptions<T>): Promise<T | null>;
  findMany(
    filter: FilterQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<T[]>;
  updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null>;
  updateMany(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<boolean>;
  deleteOne(filter: FilterQuery<T>, options?: QueryOptions<T>): Promise<boolean>;
  deleteMany(filter: FilterQuery<T>, options?: QueryOptions<T>): Promise<boolean>;
  bulkCreate(data: C[], options?: QueryOptions<T>): Promise<T[]>;
  bulkUpdate(
    updates: Array<{ filter: FilterQuery<T>; update: UpdateQuery<T> }>,
    options?: QueryOptions<T>,
  ): Promise<boolean>;
  count(filter: FilterQuery<T>, options?: QueryOptions<T>): Promise<number>;
  exists(filter: FilterQuery<T>, options?: QueryOptions<T>): Promise<boolean>;
}

export abstract class BaseRepository<C, T extends Document>
  implements IBaseRepository<C, T>
{
  constructor(
    protected readonly model: Model<T>,
    protected readonly loggerService: LoggingService,
  ) {}

  protected applyQueryOptions(query: any, options?: QueryOptions<T>): void {
    if (!options) {
      return;
    }

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

    if (options.populate) {
      query.populate(options.populate);
    }

    if (options.lean) {
      query.lean();
    }

    if (options.session) {
      query.session(options.session);
    }
  }
  async create(data: C, options?: QueryOptions<T>): Promise<T> {
    const loggerData: ILoggerData = {
      serviceName: this.constructor.name,
      function: 'create',
      message: 'executing',
    };

    try {
      this.loggerService.info(loggerData);
      const entity = new this.model(data);
      const result = await entity.save({ session: options?.session });
      this.loggerService.info({ ...loggerData, message: 'executed' });
      return result;
    } catch (error) {
      this.loggerService.error({ ...loggerData, message: 'failed' }, { error });
      throw new InternalServer('something went wrong');
    }
  }

  async findOne(filter: FilterQuery<T>, options?: QueryOptions<T>): Promise<T | null> {
    const loggerData: ILoggerData = {
      serviceName: this.constructor.name,
      function: 'findOne',
      message: 'executing',
    };

    try {
      this.loggerService.info(loggerData);
      const query = this.model.findOne(filter, options?.projection);
      this.applyQueryOptions(query, options);
      const result = await query.exec();
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
  ): Promise<T[]> {
    const loggerData: ILoggerData = {
      serviceName: this.constructor.name,
      function: 'findMany',
      message: 'executing',
    };

    try {
      this.loggerService.info(loggerData);
      const query = this.model.find(filter, options?.projection);
      this.applyQueryOptions(query, options);
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
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    const loggerData: ILoggerData = {
      serviceName: this.constructor.name,
      function: 'updateOne',
      message: 'executing',
    };

    try {
      this.loggerService.info(loggerData);
      const queryOptions: MongooseQueryOptions = {
        new: options?.new ?? true,
        upsert: options?.upsert ?? false,
        runValidators: options?.runValidators ?? false,
        setDefaultsOnInsert: options?.setDefaultsOnInsert ?? false,
        session: options?.session,
      };

      const query = this.model.findOneAndUpdate(filter, update, queryOptions);
      this.applyQueryOptions(query, options);
      const result = await query.exec();
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
    options?: QueryOptions<T>,
  ): Promise<boolean> {
    const loggerData: ILoggerData = {
      serviceName: this.constructor.name,
      function: 'updateMany',
      message: 'executing',
    };

    try {
      this.loggerService.info(loggerData);
      const query = this.model.updateMany(filter, update);
      this.applyQueryOptions(query, options);
      const result = await query.exec();
      this.loggerService.info({ ...loggerData, message: 'executed' });
      return result.modifiedCount > 0;
    } catch (error) {
      this.loggerService.error({ ...loggerData, message: 'failed' }, { error });
      throw new InternalServer('something went wrong');
    }
  }

  async deleteOne(filter: FilterQuery<T>, options?: QueryOptions<T>): Promise<boolean> {
    const loggerData: ILoggerData = {
      serviceName: this.constructor.name,
      function: 'deleteOne',
      message: 'executing',
    };

    try {
      this.loggerService.info(loggerData);
      const query = this.model.deleteOne(filter);
      this.applyQueryOptions(query, options);
      const result = await query.exec();
      this.loggerService.info({ ...loggerData, message: 'executed' });
      return result.deletedCount === 1;
    } catch (error) {
      this.loggerService.error({ ...loggerData, message: 'failed' }, { error });
      throw new InternalServer('something went wrong');
    }
  }

  async deleteMany(filter: FilterQuery<T>, options?: QueryOptions<T>): Promise<boolean> {
    const loggerData: ILoggerData = {
      serviceName: this.constructor.name,
      function: 'deleteMany',
      message: 'executing',
    };

    try {
      this.loggerService.info(loggerData);
      const query = this.model.deleteMany(filter);
      this.applyQueryOptions(query, options);
      const result = await query.exec();
      this.loggerService.info({ ...loggerData, message: 'executed' });
      return result.deletedCount > 0;
    } catch (error) {
      this.loggerService.error({ ...loggerData, message: 'failed' }, { error });
      throw new InternalServer('something went wrong');
    }
  }

  async bulkCreate(data: C[], options?: QueryOptions<T>): Promise<T[]> {
    const loggerData: ILoggerData = {
      serviceName: this.constructor.name,
      function: 'bulkCreate',
      message: 'executing',
    };

    try {
      this.loggerService.info(loggerData);
      const result = await this.model.insertMany(data, { session: options?.session });
      this.loggerService.info({ ...loggerData, message: 'executed' });
      return result as unknown as T[];
    } catch (error) {
      this.loggerService.error({ ...loggerData, message: 'failed' }, { error });
      throw new InternalServer('something went wrong');
    }
  }

  async bulkUpdate(
    updates: Array<{ filter: FilterQuery<T>; update: UpdateQuery<T> }>,
    options?: QueryOptions<T>,
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
        { session: options?.session },
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

  async count(filter: FilterQuery<T>, options?: QueryOptions<T>): Promise<number> {
    const loggerData: ILoggerData = {
      serviceName: this.constructor.name,
      function: 'count',
      message: 'executing',
    };

    try {
      this.loggerService.info(loggerData);
      const query = this.model.countDocuments(filter);
      this.applyQueryOptions(query, options);
      const result = await query.exec();
      this.loggerService.info({ ...loggerData, message: 'executed' });
      return result;
    } catch (error) {
      this.loggerService.error({ ...loggerData, message: 'failed' }, { error });
      throw new InternalServer('something went wrong');
    }
  }

  async exists(filter: FilterQuery<T>, options?: QueryOptions<T>): Promise<boolean> {
    const loggerData: ILoggerData = {
      serviceName: this.constructor.name,
      function: 'exists',
      message: 'executing',
    };

    try {
      this.loggerService.info(loggerData);
      const query = this.model.exists(filter);
      this.applyQueryOptions(query, options);
      const result = await query.exec();
      this.loggerService.info({ ...loggerData, message: 'executed' });
      return !!result;
    } catch (error) {
      this.loggerService.error({ ...loggerData, message: 'failed' }, { error });
      throw new InternalServer('something went wrong');
    }
  }
}
