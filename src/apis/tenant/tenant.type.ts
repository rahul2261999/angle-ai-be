import { z } from "zod";
import { TenantValidation } from "./tenant.validation";
import { Status } from "./tenant.enum";

export interface ITenant {
  id: number;
  name: string;
  tenantId: string;
  authKey: string;
  status: Status;
  createdBy: number;
  updatedBy: number;
  createdAt: Date;
  updatedAt: Date;
};

export interface TenantCreateAttributes {
  name: string;
  tenantId: string;
  authKey: string;
  status: Status;
  createdBy: number;
  updatedBy: number;
}

export interface TenantUpdateAttributes {
  name?: string;
  status?: Status;
  updatedBy: number;
}


export type TenantCreateReqPayload  = z.infer<typeof TenantValidation.tenantCreate>
export type TennatGetReqPayload = z.infer<typeof TenantValidation.tenantGet>
export type TenantUpdateReqPayload = z.infer<typeof TenantValidation.tenantUpdate>
export  type TenantDeleteReqPayload = z.infer<typeof TenantValidation.tenantDelete>