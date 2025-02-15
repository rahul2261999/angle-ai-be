import { Request, Response } from "express";
import { ILoggerData } from "../../utils/logger/logger.type";
import loggerService from "../../utils/logger/logger.service";
import { tenantService } from "./tenant.service";
import SuccessResponse from "../../utils/response/response.util";
import InternalServer from "../../utils/error/internal_server.error";

abstract class TenantController {
  public static async createTenant(
    request: Request,
    response: Response,
  ) {
    const loggerData: ILoggerData = {
      serviceName: 'TenantController',
      function: 'createTenant',
    };

    try {
      loggerService.info({ ...loggerData, message: 'executing' });

      const body = request.body;

      const data = await tenantService.createTenant(body);

      const customResponse = new SuccessResponse({
        message: 'Tenant created successfully',
        data
      })

      loggerService.info({ ...loggerData, message: 'executed' });

      response.status(customResponse.statusCode).json(customResponse);
    } catch (error) {
      loggerService.error({ ...loggerData, message: 'failed to execute' });

      const customError = InternalServer.fromError(error);

      response.status(customError.getStatusCode()).json(customError.toJson());
    }
  }

  public static async getTenant(
    request: Request,
    response: Response
  ) {
    const loggerData: ILoggerData = {
      serviceName: 'TenantController',
      function: 'getTenant',
    };

    try {
      loggerService.info({ ...loggerData, message: 'executing' });

      const id = +request.params.id;

      const data = await tenantService.getTenant({ id });

      const customResponse = new SuccessResponse({
        message: 'Tenant fetched successfully',
        data
      })

      loggerService.info({ ...loggerData, message: 'executed' });

      response.status(customResponse.statusCode).json(customResponse);
    } catch (error) {
      loggerService.error({ ...loggerData, message: 'failed to execute' });

      const customError = InternalServer.fromError(error);

      response.status(customError.getStatusCode()).json(customError.toJson());
    }
  }

  public static async getAllTenant(
    request: Request,
    response: Response
  ) {
    const loggerData: ILoggerData = {
      serviceName: 'TenantController',
      function: 'getAllTenant',
    };

    try {
      const data = await tenantService.getAllTenant();

      const customResponse = new SuccessResponse({
        message: 'Tenants fetched successfully',
        data
      })

      loggerService.info({ ...loggerData, message: 'executed' });

      response.status(customResponse.statusCode).json(customResponse);
    } catch (error) {
      loggerService.error({ ...loggerData, message: 'failed to execute' });

      const customError = InternalServer.fromError(error);

      response.status(customError.getStatusCode()).json(customError.toJson());
    }
  }

  public static async updateTenant(
    request: Request,
    response: Response,
  ) {
    const loggerData: ILoggerData = {
      serviceName: 'TenantController',
      function: 'updateTenant',
    };

    try {
      loggerService.info({ ...loggerData, message: 'executing' });

      const body = request.body;

      const data = await tenantService.updateTenant({
        ...body,
        values: {
          ...body.values,
          updatedBy: 1
        }
      });

      const customResponse = new SuccessResponse({
        message: 'Tenant updated successfully',
        data
      })

      loggerService.info({ ...loggerData, message: 'executed' });

      response.status(customResponse.statusCode).json(customResponse);
    } catch (error) {
      loggerService.error({ ...loggerData, message: 'failed to execute' });

      const customError = InternalServer.fromError(error);

      response.status(customError.getStatusCode()).json(customError.toJson());
    }
  }

  public static async deleteTenant(
    request: Request,
    response: Response,
  ) {
    const loggerData: ILoggerData = {
      serviceName: 'TenantController',
      function: 'deleteTenant',
    };

    try {
      loggerService.info({ ...loggerData, message: 'executing' });

      const id = +request.params.id;

      const data = await tenantService.deleteTenant({ id });

      const customResponse = new SuccessResponse({
        message: 'Tenant deleted successfully',
        data
      })

      loggerService.info({ ...loggerData, message: 'executed' });

      response.status(customResponse.statusCode).json(customResponse);
    } catch (error) {
      loggerService.error({ ...loggerData, message: 'failed to execute' });

      const customError = InternalServer.fromError(error);

      response.status(customError.getStatusCode()).json(customError.toJson());
    }
  }
}

export { TenantController }