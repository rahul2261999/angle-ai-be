import { Router } from "express";
import { healthRouter } from "./health/health.router";
import { tenantRoute } from "./tenant/tenant.route";

const mainRouter = Router();

mainRouter.use('/health', healthRouter)
mainRouter.use('/main', tenantRoute);

export { mainRouter }