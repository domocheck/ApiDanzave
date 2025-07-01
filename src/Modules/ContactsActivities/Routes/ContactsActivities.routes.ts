import { Router } from "express";
import { assignActivity, getActivityById, getObservationsByContactId, getPagedListContactsActivities, updateActivity } from "../Controller/ContactsActivities.controller";

const router: Router = Router();

router.get("/getObservationsByContactId", getObservationsByContactId)
    .get("/getPagedListContactActivities", getPagedListContactsActivities)
    .get("/getActivityById", getActivityById)
    .put("/assignActivity", assignActivity)
    .post("/updateActivity", updateActivity);


export { router as RouteContactsActivities };