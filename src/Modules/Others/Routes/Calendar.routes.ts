import { Router } from "express";
import { getScheduleInfo } from "../Controller/Calendar.controller";

const router: Router = Router();

router.get("/getScheduleInfo", getScheduleInfo);

export { router as RouteCalendar };
