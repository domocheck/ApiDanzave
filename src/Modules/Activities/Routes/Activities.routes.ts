import { Router } from "express";
import { getActivities } from "../Controller/Activities.controller";

const router: Router = Router();

router.get("/getActivities", getActivities);

export { router as RouteActivities };
