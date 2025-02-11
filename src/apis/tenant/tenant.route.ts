
import express from 'express';
import { TenantController } from './tenant.controller';

const tenantRoute = express();

tenantRoute.post('/tenant', TenantController.createTenant);
tenantRoute.get('/tenant/:id', TenantController.getTenant);
tenantRoute.get('/tenant/all', TenantController.getAllTenant);
tenantRoute.put('/tenant/:id', TenantController.updateTenant);

export { tenantRoute }