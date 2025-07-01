import { Router } from "express";
import { editAccount, generateAccount, generateStudentsAccounts, generateTeachersAccounts, getAccountsStudentsActives, getIndAccount, getPagedListAccounts, getPagedListUnpaidAccounts, getSettleFormInfo, getStatusAccountsStudent, getStatusAccountsTeacher, settleAccount } from "../Controller/Accounts.controller";

const router: Router = Router();

router.get("/getAccountsStudentsActives", getAccountsStudentsActives)
    .get("/getStatusAccountsStudent", getStatusAccountsStudent)
    .get("/getStatusAccountsTeacher", getStatusAccountsTeacher)
    // .get("/deleteDuplicatedAccounts", deleteDuplicatedAccounts)
    .get("/getIndAccount", getIndAccount)
    .get("/getSettleFormInfo", getSettleFormInfo)
    .get("/getPagedListAccounts", getPagedListAccounts)
    .get("/getPagedListUnpaidAccounts", getPagedListUnpaidAccounts)
    .put("/editAccount", editAccount)
    .post("/generateStudentsAccounts", generateStudentsAccounts)
    .post("/generateTeachersAccounts", generateTeachersAccounts)
    .post("/generateAccount", generateAccount)
    .post("/settleAccount", settleAccount);

export { router as RouteAccounts };