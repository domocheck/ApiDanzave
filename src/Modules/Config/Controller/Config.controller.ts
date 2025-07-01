import { Request, Response } from "express";
import { Config } from "../Models/Config.models";
import { changeStatusPriceService, getConfigFromContactsPagedListService, getConfigService, getPagedListPricesService, getPaymentsMethodsService, getReasonsService, saveItemsToSeeService, savePaymentMethodService, savePriceService, saveRangeHoursService, saveRangeStudentsService, saveReferenceService } from "../Service/Config.service";
import { ConfigContactsPagedList } from "../../Contacts/Models/Contacts-paged-list.modelst";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { PagedListPrices, SearchPagedListPrices } from "../Models/Price-paged-list.model";

export const getReasons = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getReasonsService();
        res.status(200).send(response);
    } catch (error: any) {
        let response = new Config();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const getPaymentsMethods = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getPaymentsMethodsService();
        res.status(200).send(response);
    } catch (error: any) {
        let response = new Config();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const getConfigFromContactsPagedList = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getConfigFromContactsPagedListService();
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ConfigContactsPagedList();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const getConfig = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getConfigService();
        res.status(200).send(response);
    } catch (error: any) {
        let response = new Config();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const saveItemsToSee = async (req: Request, res: Response): Promise<void> => {
    let { quantity } = req.body;
    try {
        const response = await saveItemsToSeeService(Number(quantity));
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const savePaymentMethod = async (req: Request, res: Response): Promise<void> => {
    let { paymentName, paymentId } = req.body;
    try {
        const response = await savePaymentMethodService(paymentName as string, paymentId as string);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const saveReference = async (req: Request, res: Response): Promise<void> => {
    let { referenceId, referenceName, type } = req.body;
    try {
        const response = await saveReferenceService(referenceId as string, referenceName as string, type as string);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const saveRangeHours = async (req: Request, res: Response): Promise<void> => {
    let { index, initialHour, finalHour } = req.body;
    try {
        const response = await saveRangeHoursService(+index, +initialHour, +finalHour);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const saveRangeStudents = async (req: Request, res: Response): Promise<void> => {
    let { value, range } = req.body;
    try {
        const response = await saveRangeStudentsService(+value, range);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const savePrice = async (req: Request, res: Response): Promise<void> => {
    let { price, type } = req.body;
    try {
        const response = await savePriceService(price, type);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const getPagedListPrices = async (req: Request, res: Response): Promise<void> => {
    const { name, status, page, type } = req.query
    try {
        const search = new SearchPagedListPrices()
        search.Name = name as string,
            search.Status = status as string,
            search.Page = Number(page)
        search.Type = type as string
        const response = await getPagedListPricesService(search);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new PagedListPrices()
        response.setError(error.message)
        res.status(500).send(response)
    }
}

export const changeStatusPrice = async (req: Request, res: Response): Promise<void> => {
    const { priceId, type } = req.query;
    try {
        if (!priceId) throw new Error('Los campos son requeridos');
        const response = await changeStatusPriceService(priceId as string, type as string);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        res.status(500).send(response);
    }

}
