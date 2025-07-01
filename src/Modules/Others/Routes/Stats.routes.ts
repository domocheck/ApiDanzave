import { Router } from "express";
import { getAssistsByDate, getAssistsByDateFilteringOptions, getAssistsControl, getAssistsControlFilteringOptions, getHistoryAssists, getHistoryClasses, getPagedListAccountsExpiration, getPagedListAvgAssists, getPagedListContactsProofClass, getPagedListEnrolledStudents, getPagedListPaymentMethod, getPagedListPBS, getPagedListSaleStats, getPagedListStudentsActives, getPagedListStudentsInactives } from "../Controller/Stats.controller";

const router: Router = Router();

router.get("/getPagedListPBS", getPagedListPBS)
    .get("/getPagedListPaymentMethod", getPagedListPaymentMethod)
    .get("/getPagedListSaleStats", getPagedListSaleStats)
    .get("/getPagedListAccountsExpiration", getPagedListAccountsExpiration)
    .get("/getPagedListStudentsInactives", getPagedListStudentsInactives)
    .get("/getPagedListStudentsActives", getPagedListStudentsActives)
    .get("/getPagedListContactsProofClass", getPagedListContactsProofClass)
    .get("/getPagedListEnrolledStudents", getPagedListEnrolledStudents)
    .get("/getAssistsByDate", getAssistsByDate)
    .get("/getAssistsByDateFilteringOptions", getAssistsByDateFilteringOptions)
    .get("/getAssistsControl", getAssistsControl)
    .get("/getAssistsControlFilteringOptions", getAssistsControlFilteringOptions)
    .get("/getPagedListAvgAssists", getPagedListAvgAssists)
    .get("/getHistoryClasses", getHistoryClasses)
    .get("/getHistoryAssists", getHistoryAssists)

export { router as RouteStats };
