import crypto from 'crypto';
import { ulid } from "ulid";
import InternalServer from "../../utils/error/internal_server.error";
import loggerService from "../../utils/logger/logger.service";
import { ILoggerData } from "../../utils/logger/logger.type";
import { ITenant, TenantCreateAttributes, TenantCreateReqPayload, TenantUpdateAttributes, TenantUpdateReqPayload, TennatGetReqPayload as TenantGetReqPayload } from "./tenant.type";
import { tenantRepository } from './tenant.repo';
import { FindOptions, UpdateOptions } from 'sequelize';
import { TenantValidation } from './tenant.validation';
import { Status } from './tenant.enum';

class TenantService {
  private static instance: TenantService;

  private constructor() { }

  public static getInstances(): TenantService {
    if (!TenantService.instance) {
      TenantService.instance = new TenantService();
    }
    return TenantService.instance;
  }

  public async createTenant(params: TenantCreateReqPayload): Promise<ITenant> {
    const loggerData: ILoggerData = {
      serviceName: 'TenantService',
      function: 'createTenant',
    };

    try {
      loggerService.info({ ...loggerData, message: 'executing' });

      const validation = TenantValidation.tenantCreate.safeParse(params);

      if (!validation.success) {
        throw new InternalServer(validation.error.message, { error: validation.error.errors });
      }

      const validatedParams = validation.data;

      const authKey = crypto.randomBytes(32).toString('hex')

      const tenantCreateParams: TenantCreateAttributes = {
        name: validatedParams.name,
        tenantId: ulid(),
        authKey,
        status: Status.ACTIVE,
        createdBy: 1,
        updatedBy: 1,
      }

      const tenant = await tenantRepository.create(tenantCreateParams);

      if (!tenant) {
        throw new InternalServer("Failed to create tenant");
      }

      loggerService.info({ ...loggerData, message: 'executed' });

      return tenant;
    } catch (error) {
      loggerService.error({ ...loggerData, message: 'failed to execute' });

      throw InternalServer.fromError(error);
    }
  }

  public async getTenant(params: TenantGetReqPayload): Promise<ITenant | undefined> {
    const loggerData: ILoggerData = {
      serviceName: 'TenantService',
      function: 'getTenant',
    };

    try {
      loggerService.info({ ...loggerData, message: 'executing' });

      const validation = TenantValidation.tenantGet.safeParse(params);

      if (!validation.success) {
        throw new InternalServer(validation.error.message, { error: validation.error.errors });
      }

      const validatedParams = validation.data;

      const findOptions: FindOptions<ITenant> = {
        where: {
          tenantId: validatedParams.id,
        },
      };

      const tenant = await tenantRepository.findOne(findOptions);

      loggerService.info({ ...loggerData, message: 'executed' });

      return tenant;
    } catch (error) {
      loggerService.error({ ...loggerData, message: 'failed to execute' });

      throw InternalServer.fromError(error);
    }
  }

  public async getAllTenant(): Promise<ITenant[]> {
    const loggerData: ILoggerData = {
      serviceName: 'TenantService',
      function: 'getAllTenant',
    };

    try {
      loggerService.info({ ...loggerData, message: 'executing' });

      const tenants = await tenantRepository.findAll();

      loggerService.info({ ...loggerData, message: 'executed' });

      return tenants;
    } catch (error) {
      loggerService.error({ ...loggerData, message: 'failed to execute' });

      throw InternalServer.fromError(error);
    }
  }

  async updateTenant(params: TenantUpdateReqPayload): Promise<number> {
    const loggerData: ILoggerData = {
      serviceName: 'TenantService',
      function: 'updateTenant',
    };

    try {
      loggerService.info({ ...loggerData, message: 'executing' });

      const validation = TenantValidation.tenantUpdate.safeParse(params);

      if (!validation.success) {
        throw new InternalServer(validation.error.message, { error: validation.error.errors });
      }

      const validatedParams = validation.data;


      const tenantUpdateParams: TenantUpdateAttributes = { updatedBy: 1 };
      if (validatedParams.values.name) {
        tenantUpdateParams.name = validatedParams.values.name;
      }

      if (validatedParams.values.status) {
        tenantUpdateParams.status = validatedParams.values.status;
      }

      const updateOption: UpdateOptions<ITenant> = {
        where: {
          id: params.filter.id,
        }
      }

      const updatedTenant = await tenantRepository.update(tenantUpdateParams, updateOption)


      loggerService.info({ ...loggerData, message: 'executed' });
      loggerService.debug({ ...loggerData, message: `records updated: ${updatedTenant}` });

      return updatedTenant
    } catch (error) {
      loggerService.error({ ...loggerData, message: 'failed to execute' });

      throw InternalServer.fromError(error);
    }
  }
}

const tenantService = TenantService.getInstances();

export { tenantService }
