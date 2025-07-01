import { Router } from "express";
import { addRecoverStudent, changeStatusStudent, getOptionsFormStudent, getPagedListStudents, getStudentById, getStudentsActives, saveStudent } from "../Controller/Students.controller";

const router: Router = Router();

router.get("/addRecoverStudent", addRecoverStudent)
    .get("/getStudentById", getStudentById)
    .get("/getPagedListStudents", getPagedListStudents)
    .get("/getOptionsFormStudent", getOptionsFormStudent)
    .get("/getStudentsActives", getStudentsActives)
    .put("/changeStatusStudent", changeStatusStudent)
    .post("/saveStudent", saveStudent)

export { router as RouteStudents };