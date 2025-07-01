import { Router } from "express";
import { changeStatusContact, getContactById, getOptionsFormContact, getPagedListContacts, saveContact } from "../Controller/Contacts.controller";

const router: Router = Router();

router
    .get("/getPagedListContacts", getPagedListContacts)
    .get("/getContactById", getContactById)
    .get("/getOptionsFormContact", getOptionsFormContact)
    .put("/changeStatusContact", changeStatusContact)
    .post("/saveContact", saveContact)


export { router as RouteContacts };