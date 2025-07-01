import { Router } from "express";
import { changeStatusProduct, getOptionsFormProduct, getPagedListProductChooser, getPagedListProducts, getProductById, saveProduct, saveSale, saveStock } from "../Controller/Boutique.controller";

const router: Router = Router();

router.get("/getPagedListProducts", getPagedListProducts)
    .get("/getPagedListProductChooser", getPagedListProductChooser)
    .get("/getOptionsFormProduct", getOptionsFormProduct)
    .get("/getProductById", getProductById)
    .put("/changeStatusProduct", changeStatusProduct)
    .post("/saveProduct", saveProduct)
    .post("/saveStock", saveStock)
    .post("/saveSale", saveSale)


export { router as RouteBoutique };