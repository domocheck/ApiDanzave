import { Router } from "express";
import { changeStatusTeacher, getOptionsFormTeacher, getPagedListTeachers, getSubstitutes, getTeacherById, saveTeacher } from "../Controller/Teachers.controller";

const router: Router = Router();

router.get("/getSubstitutes", getSubstitutes)
    .get("/getPagedListTeachers", getPagedListTeachers)
    .get("/getTeacherById", getTeacherById)
    .get("/getOptionsFormTeacher", getOptionsFormTeacher)
    .put("/changeStatusTeacher", changeStatusTeacher)
    .post("/saveTeacher", saveTeacher);

export { router as RouteTeachers };