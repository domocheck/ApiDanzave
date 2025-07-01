import { Router } from "express";
import { changeStatusPrice, getConfig, getConfigFromContactsPagedList, getPagedListPrices, getPaymentsMethods, getReasons, saveItemsToSee, savePaymentMethod, savePrice, saveRangeHours, saveRangeStudents, saveReference } from "../Controller/Config.controller";

const router: Router = Router();

router.get("/getReasons", getReasons)
    .get("/getConfig", getConfig)
    .get("/getPaymentsMethods", getPaymentsMethods)
    .get("/getConfigFromContactsPagedList", getConfigFromContactsPagedList)
    .get("/getPagedListPrices", getPagedListPrices)
    .put("/changeStatusPrice", changeStatusPrice)
    .post("/saveItemsToSee", saveItemsToSee)
    .post("/savePaymentMethod", savePaymentMethod)
    .post("/saveReference", saveReference)
    .post("/saveRangeHours", saveRangeHours)
    .post("/saveRangeStudents", saveRangeStudents)
    .post("/savePrice", savePrice)

export { router as RouteConfig };