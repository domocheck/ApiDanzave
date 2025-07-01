import { Request, Response } from "express";
import { PagedListProducts, SearchPagedListProducts } from "../Models/Paged-list-products.models";
import { changeStatusProductsService, getOptionsFormProductService, getPagedListProductChooserService, getPagedListProductsService, getProductByIdService, saveProductService, saveSaleService, saveStockService } from "../Service/Boutique.service";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { OptionsFormProduct, ProductsResponse } from "../Models/Products.models";
import { PagedListProductChooser, SearchPagedListProductChooser } from "../Models/Sale-product-paged-list.model";

export const getProductById = async (req: Request, res: Response): Promise<void> => {
    const { productId } = req.query;
    try {
        if (!productId) throw new Error('Los campos son requeridos');
        const response = await getProductByIdService(productId as string);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ProductsResponse();
        response.setError(error.message);
        res.status(500).send(response);
    }

}
export const getPagedListProducts = async (req: Request, res: Response): Promise<void> => {
    let { name, page, status, category } = req.query;
    try {
        const search: SearchPagedListProducts = {
            Name: name as string,
            Status: status as string,
            Page: Number(page),
            Category: category as string
        };
        const response = await getPagedListProductsService(search);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new PagedListProducts();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const getPagedListProductChooser = async (req: Request, res: Response): Promise<void> => {
    let { name, page, category } = req.query;
    try {
        const search: SearchPagedListProductChooser = {
            Name: name as string,
            Page: Number(page),
            Category: category as string
        };
        const response = await getPagedListProductChooserService(search);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new PagedListProductChooser();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const changeStatusProduct = async (req: Request, res: Response): Promise<void> => {
    const { productId } = req.query;
    try {
        if (!productId) throw new Error('El id es requerido');
        const response = await changeStatusProductsService(productId as string);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        res.status(500).send(response);
    }

}

export const getOptionsFormProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getOptionsFormProductService();
        res.status(200).send(response);
    } catch (error: any) {
        let response = new OptionsFormProduct();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const saveProduct = async (req: Request, res: Response): Promise<void> => {
    let response = new ResponseMessages();
    const product = req.body;
    try {
        if (!product) throw new Error('Los campos son requeridos');
        response = await saveProductService(product);
        res.status(200).send(response);
    } catch (error: any) {
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const saveStock = async (req: Request, res: Response): Promise<void> => {
    let response = new ResponseMessages();
    const product = req.body;
    try {
        if (!product) throw new Error('Los campos son requeridos');
        response = await saveStockService(product);
        res.status(200).send(response);
    } catch (error: any) {
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const saveSale = async (req: Request, res: Response): Promise<void> => {
    let response = new ResponseMessages();
    const sale = req.body;
    try {
        if (!sale) throw new Error('Los campos son requeridos');
        response = await saveSaleService(sale);
        res.status(200).send(response);
    } catch (error: any) {
        response.setError(error.message);
        res.status(500).send(response);
    }
}