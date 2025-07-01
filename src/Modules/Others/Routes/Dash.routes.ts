import { Router } from "express";
import { getActivitiesDashReport, getPaymentMethodsDashReport, getPeopleTraffickingDashReport, getRankigDaysDashReport, getStudentsDashReport } from "../Controller/Dash.controller";

const router: Router = Router();

router.get("/getStudentsDashReport", getStudentsDashReport)
    .get("/getPaymentMethodsDashReport", getPaymentMethodsDashReport)
    .get("/getRankigDaysDashReport", getRankigDaysDashReport)
    .get("/getPeopleTraffickingDashReport", getPeopleTraffickingDashReport)
    .get("/getActivitiesDashReport", getActivitiesDashReport)

export { router as RouteDashboard };
