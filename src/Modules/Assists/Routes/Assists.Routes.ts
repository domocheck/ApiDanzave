import { Router } from "express";
import { chargePresences, createAssists, generatePresence, getHistoryContactAssist, getHistoryStudentAssist, getHistoryTeacherAssist, getIdAssistByActivityId, getIdAssistByClassId } from "../Controller/Assists.controller";

const router: Router = Router();

router.get("/createAssists", createAssists)
    .get("/getIdAssistByClassId", getIdAssistByClassId)
    .get("/getIdAssistByActivityId", getIdAssistByActivityId)
    .get("/generatePresence", generatePresence)
    .get("/getHistoryStudentAssist", getHistoryStudentAssist)
    .get("/getHistoryTeacherAssist", getHistoryTeacherAssist)
    .get("/getHistoryContactAssist", getHistoryContactAssist)
    .post("/chargePresences", chargePresences)

export { router as RouteAssists };