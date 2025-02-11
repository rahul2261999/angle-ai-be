import { CreateOptions, FindOptions, UpdateOptions } from "sequelize";
import InternalServer from "../../utils/error/internal_server.error";
import loggerService from "../../utils/logger/logger.service";
import { ILoggerData } from "../../utils/logger/logger.type";
import { ITenant, TenantCreateAttributes, TenantUpdateAttributes } from "./tenant.type";
import { Tenant } from "../../database/models/tenant";

class TenantRepository {
  private static instance: TenantRepository;

  private constructor() { }

  public static getInstance(): TenantRepository {
    if (!TenantRepository.instance) {
      TenantRepository.instance = new TenantRepository();
    }
    return TenantRepository.instance;
  }

  public async create(params: TenantCreateAttributes): Promise<ITenant | undefined> {
    const loggerData: ILoggerData = {
      serviceName: 'TenantRepository',
      function: 'create',
    };

    try {
      loggerService.info({ ...loggerData, message: 'executing' });

      const tenant = await Tenant.create(params)

      loggerService.info({ ...loggerData, message: 'executed' });

      return tenant?.toJSON();
    } catch (error) {
      loggerService.error({ ...loggerData, message: 'failed to execute' }, { error });

      throw new InternalServer("Something went wrong");
    }
  }

  public async findOne(params: FindOptions<ITenant>): Promise<ITenant | undefined> {
    const loggerData: ILoggerData = {
      serviceName: 'TenantRepository',
      function: 'findOne',
    };

    try {
      loggerService.info({ ...loggerData, message: 'executing' });

      const tenant = await Tenant.findOne(params)

      loggerService.info({ ...loggerData, message: 'executed' });

      return tenant?.toJSON();
    } catch (error) {
      loggerService.error({ ...loggerData, message: 'failed to execute' }, { error });

      throw new InternalServer("Something went wrong");
    }
  }

  public async findAll(params?: FindOptions<ITenant>): Promise<ITenant[]> {
    const loggerData: ILoggerData = {
      serviceName: 'TenantRepository',
      function: 'findAll',
    };

    try {
      loggerService.info({ ...loggerData, message: 'executing' });

      const tenant = await Tenant.findAll(params)

      loggerService.info({ ...loggerData, message: 'executed' });

      return tenant.map(it => it.toJSON());
    } catch (error) {
      loggerService.error({ ...loggerData, message: 'failed to execute' }, { error });

      throw new InternalServer("Something went wrong");
    }
  }

  public async update(params: TenantUpdateAttributes, findOptions: UpdateOptions<ITenant>): Promise<number> {
    const loggerData: ILoggerData = {
      serviceName: 'TenantRepository',
      function: 'update',
    };

    try {
      loggerService.info({ ...loggerData, message: 'executing' });

      const tenant = await Tenant.update(params, findOptions)

      loggerService.info({ ...loggerData, message: 'executed' });

      return tenant[0];
    } catch (error) {
      loggerService.error({ ...loggerData, message: 'failed to execute' }, { error });

      throw new InternalServer("Someting went wrong");
    }
  }

}

const tenantRepository = TenantRepository.getInstance();

export { tenantRepository }