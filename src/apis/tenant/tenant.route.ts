
import express from 'express';
import { TenantController } from './tenant.controller';

const tenantRoute = express();

tenantRoute.post('/tenant', TenantController.createTenant);
tenantRoute.get('/tenant/all', TenantController.getAllTenant);
tenantRoute.put('/tenant', TenantController.updateTenant);
tenantRoute.get('/tenant/:id', TenantController.getTenant);
tenantRoute.delete('/tenant/:id', TenantController.deleteTenant);


export { tenantRoute }