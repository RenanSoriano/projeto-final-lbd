import { Router } from "express";
import { HttpError } from "../errors/http-error.js";
import { getAuthenticatedUser, requireAuth } from "../middleware/require-auth.js";
import {
  getAdminOverviewReport,
  getAdminTopConstructorsReport,
  getAdminTopDriversReport,
  getConstructorDriversReport,
  getConstructorRaceResultsReport,
  getDriverPerformanceSummaryReport,
  getDriverRaceResultsReport
} from "../services/reports-service.js";
import { UserType, type AuthUser } from "../types/auth.js";

export const reportsRouter = Router();

reportsRouter.use(requireAuth);

function requireUserType(user: AuthUser, tipo: UserType) {
  if (user.tipo !== tipo) {
    throw new HttpError(403, "Report not available for this user type");
  }
}

reportsRouter.get("/admin/overview", async (request, response, next) => {
  try {
    const user = getAuthenticatedUser(request);
    requireUserType(user, UserType.Admin);

    response.json({ rows: await getAdminOverviewReport() });
  } catch (error) {
    next(error);
  }
});

reportsRouter.get("/admin/top-drivers", async (request, response, next) => {
  try {
    const user = getAuthenticatedUser(request);
    requireUserType(user, UserType.Admin);

    response.json({ rows: await getAdminTopDriversReport() });
  } catch (error) {
    next(error);
  }
});

reportsRouter.get("/admin/top-constructors", async (request, response, next) => {
  try {
    const user = getAuthenticatedUser(request);
    requireUserType(user, UserType.Admin);

    response.json({ rows: await getAdminTopConstructorsReport() });
  } catch (error) {
    next(error);
  }
});

reportsRouter.get("/constructor/drivers", async (request, response, next) => {
  try {
    const user = getAuthenticatedUser(request);
    requireUserType(user, UserType.Escuderia);

    response.json({ rows: await getConstructorDriversReport(user) });
  } catch (error) {
    next(error);
  }
});

reportsRouter.get("/constructor/race-results", async (request, response, next) => {
  try {
    const user = getAuthenticatedUser(request);
    requireUserType(user, UserType.Escuderia);

    response.json({ rows: await getConstructorRaceResultsReport(user) });
  } catch (error) {
    next(error);
  }
});

reportsRouter.get("/driver/race-results", async (request, response, next) => {
  try {
    const user = getAuthenticatedUser(request);
    requireUserType(user, UserType.Piloto);

    response.json({ rows: await getDriverRaceResultsReport(user) });
  } catch (error) {
    next(error);
  }
});

reportsRouter.get("/driver/performance-summary", async (request, response, next) => {
  try {
    const user = getAuthenticatedUser(request);
    requireUserType(user, UserType.Piloto);

    response.json({ rows: await getDriverPerformanceSummaryReport(user) });
  } catch (error) {
    next(error);
  }
});
