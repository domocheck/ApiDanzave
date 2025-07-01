import { Router } from "express";
import { changeClassStatus, changeJuvetActivityStatus, getClasseById, getClasses, getJuvetActivityById, getOptionsFormClasse, getPagedListClasses, getPagedListJuvetActivities, removeStudentFromClass, saveClasse, saveJuvetActivity } from "../Controller/Classes.controller";

const router: Router = Router();

router.get("/getClasses", getClasses)
    .get("/getPagedListClasses", getPagedListClasses)
    .get("/getPagedListJuvetActivities", getPagedListJuvetActivities)
    .get("/getOptionsFormClasse", getOptionsFormClasse)
    .get("/getClasseById", getClasseById)
    .get("/getJuvetActivityById", getJuvetActivityById)
    .put("/changeClassStatus", changeClassStatus)
    .put("/changeJuvetActivityStatus", changeJuvetActivityStatus)
    .post("/saveClasse", saveClasse)
    .post("/saveJuvetActivity", saveJuvetActivity)
    .delete("/removeStudentFromClass", removeStudentFromClass)

export { router as RouteClasses };
