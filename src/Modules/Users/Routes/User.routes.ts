import { Router } from "express";
import { changeUserStatus, getOptionsFormUser, getPagedListUsers, getUserById, saveUser } from "../Controller/User.controller";

const router: Router = Router();

router.get("/getPagedListUsers", getPagedListUsers)
    .get("/getOptionsFormUser", getOptionsFormUser)
    .get("/getUserById", getUserById)
    .put("/changeUserStatus", changeUserStatus)
    .post("/saveUser", saveUser)


export { router as RouteUsers }