import { Router } from "express";
import { getAuthenticatedUser, requireAuth } from "../middleware/require-auth.js";
import { getDashboard } from "../services/dashboard-service.js";

export const dashboardRouter = Router();

dashboardRouter.get("/", requireAuth, async (request, response, next) => {
  try {
    const dashboard = await getDashboard(getAuthenticatedUser(request));

    response.json(dashboard);
  } catch (error) {
    next(error);
  }
});
