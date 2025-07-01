import { Request, Response } from "express";
import { EditMovement, EditMovementAndUpdateAccount, OpenDrawerResponse } from "../Models/Drawer.models";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { closeDrawerService, deleteMovementService, editMovementAndUpdateAccountService, editMovementService, getCloseDrawerFormService, getExpenseFormService, getManualMoveFormService, getOpenDrawerService, getPagedListDrawersService, getPagedListExpensesService, getPagedListHistoryDrawersService, getReceiptFormService, openDrawerService, saveMovementService } from "../Service/Drawer.service";
import { PagedListDrawers, SearchPagedListDrawers } from "../Models/Drawer-paged-list.model";
import { CloseDrawerForm, ExpenseForm, ManualMoveForm, ReceiptForm } from "../Models/Forms.model";
import { PagedListHistoryDrawers, SearchPagedListHistoryDrawers } from "../Models/History-drawers-paged-list.model";
import { PagedListExpenses, SearchPagedListExpenses } from "../Models/Expenses.paged-lilst.model";

export const editMovement = async (req: Request, res: Response): Promise<void> => {
    let editMovement: EditMovement = req.body;
    try {
        const response = await editMovementService(editMovement);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const editMovementAndUpdateAccount = async (req: Request, res: Response): Promise<void> => {
    let editMovement: EditMovementAndUpdateAccount = req.body;
    try {
        const response = await editMovementAndUpdateAccountService(editMovement);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const saveMovement = async (req: Request, res: Response): Promise<void> => {
    let movement = req.body;
    try {
        const response = await saveMovementService(movement);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const deleteMovement = async (req: Request, res: Response): Promise<void> => {
    let { movementId } = req.query;
    try {
        const response = await deleteMovementService(movementId as string);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const getPagedListDrawers = async (req: Request, res: Response): Promise<void> => {
    const { name, typeSearch, page, drawerId } = req.query
    try {
        const search = new SearchPagedListDrawers()
        search.Name = name as string,
            search.Type = typeSearch as string,
            search.Page = Number(page)
        search.DrawerId = drawerId as string
        const response = await getPagedListDrawersService(search);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new PagedListDrawers()
        response.setError(error.message)
        res.status(500).send(response)
    }
}

export const getPagedListHistoryDrawers = async (req: Request, res: Response): Promise<void> => {
    const { startDate, endDate, status, page } = req.query
    try {
        const search = new SearchPagedListHistoryDrawers()
        search.StartDate = startDate ? new Date(startDate as string) : undefined
        search.EndDate = endDate ? new Date(endDate as string) : undefined
        search.Status = status as string
        search.Page = Number(page)
        const response = await getPagedListHistoryDrawersService(search);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new PagedListHistoryDrawers()
        response.setError(error.message)
        res.status(500).send(response)
    }
}

export const getPagedListExpenses = async (req: Request, res: Response): Promise<void> => {
    const { startDate, endDate, type, page } = req.query
    try {
        const search = new SearchPagedListExpenses()
        search.StartDate = startDate ? new Date(startDate as string) : undefined
        search.EndDate = endDate ? new Date(endDate as string) : undefined
        search.Type = type as string
        search.Page = Number(page)
        const response = await getPagedListExpensesService(search);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new PagedListExpenses()
        response.setError(error.message)
        res.status(500).send(response)
    }
}

export const closeDrawer = async (req: Request, res: Response): Promise<void> => {
    const { drawerId } = req.query
    try {
        const response = await closeDrawerService(drawerId as string);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ResponseMessages()
        response.setError(error.message)
        res.status(500).send(response)
    }
}

export const openDrawer = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await openDrawerService();
        res.status(200).send(response);
    } catch (error: any) {
        let response = new OpenDrawerResponse()
        response.setError(error.message)
        res.status(500).send(response)
    }
}

export const getOpenDrawerId = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getOpenDrawerService();
        res.status(200).send(response);
    } catch (error: any) {
        let response = new OpenDrawerResponse()
        response.setError(error.message)
        res.status(500).send(response)
    }
}

export const getExpenseForm = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getExpenseFormService();
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ExpenseForm();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const getReceiptForm = async (req: Request, res: Response): Promise<void> => {
    let { type } = req.query
    try {
        const response = await getReceiptFormService(type as string);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ReceiptForm();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const getManualMoveForm = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getManualMoveFormService();
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ManualMoveForm();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const getCloseDrawerForm = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getCloseDrawerFormService();
        res.status(200).send(response);
    } catch (error: any) {
        let response = new CloseDrawerForm();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

