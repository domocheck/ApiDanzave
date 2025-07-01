import { Router } from "express";
import { closeDrawer, deleteMovement, editMovement, editMovementAndUpdateAccount, getCloseDrawerForm, getExpenseForm, getManualMoveForm, getOpenDrawerId, getPagedListDrawers, getPagedListExpenses, getPagedListHistoryDrawers, getReceiptForm, openDrawer, saveMovement } from "../Controller/Drawer.controller";

const router: Router = Router();

router.get("/getPagedListDrawers", getPagedListDrawers)
    .get("/getPagedListHistoryDrawers", getPagedListHistoryDrawers)
    .get("/getPagedListExpenses", getPagedListExpenses)
    .get("/getExpenseForm", getExpenseForm)
    .get("/getCloseDrawerForm", getCloseDrawerForm)
    .get("/getReceiptForm", getReceiptForm)
    .get("/getManualMoveForm", getManualMoveForm)
    .get("/getOpenDrawerId", getOpenDrawerId)
    .put("/editMovement", editMovement)
    .put("/editMovementAndUpdateAccount", editMovementAndUpdateAccount)
    .put("/closeDrawer", closeDrawer)
    .put("/openDrawer", openDrawer)
    .post("/saveMovement", saveMovement)
    .delete("/deleteMovement", deleteMovement);

export { router as RouteDrawer };