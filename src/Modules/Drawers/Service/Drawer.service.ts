import { updateAccountByEditMovementRepository } from "../../Accounts/Repository/Accounts.repository";
import { getPersonWhitDebt } from "../../Accounts/Service/Accounts.service";
import { getPaymentsMethodsFromConfigRepository } from "../../Config/Repository/Config.repository";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { getPagedListDrawers } from "../Controller/Drawer.controller";
import { PagedListDrawers, SearchPagedListDrawers } from "../Models/Drawer-paged-list.model";
import { EditMovement, EditMovementAndUpdateAccount, IMovement, OpenDrawerResponse } from "../Models/Drawer.models";
import { PagedListExpenses, SearchPagedListExpenses } from "../Models/Expenses.paged-lilst.model";
import { CloseDrawerForm, ExpenseForm, ManualMoveForm, ReceiptForm } from "../Models/Forms.model";
import { PagedListHistoryDrawers, SearchPagedListHistoryDrawers } from "../Models/History-drawers-paged-list.model";
import { closeDrawerRepository, deleteMovementRepository, editMovementRepository, getChasDrawerOpenRepository, getExpensesTypeRepository, getPagedListDrawersRepository, getPagedListExpensesRepository, getPagedListHistoryDrawersRepository, openDrawerRepository, saveMovementRepository } from "../Repository/Drawer.repository";

export const editMovementService = async (editMovement: EditMovement): Promise<ResponseMessages> => {
    return await editMovementRepository(editMovement);
}

export const editMovementAndUpdateAccountService = async (editMovement: EditMovementAndUpdateAccount): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    const editMove = await editMovementRepository(editMovement);
    if (editMove.hasErrors()) {
        response.setError('Error interno del servidor, intente nuevamente');
        return response;
    }
    response = await updateAccountByEditMovementRepository(editMovement.account, editMovement.type);
    return response;
}

export const saveMovementService = async (movement: IMovement): Promise<ResponseMessages> => {
    let response = new ResponseMessages()
    const cashDrawer = await getChasDrawerOpenRepository();
    if (cashDrawer && cashDrawer.status === 'open') {
        const save = await saveMovementRepository(movement, cashDrawer.id)
        response = save
    } else {
        response.setError('La caja no esta abierta');
    }
    return response;
}

export const deleteMovementService = async (movementId: string): Promise<ResponseMessages> => {
    let response = new ResponseMessages()
    const cashDrawer = await getChasDrawerOpenRepository();
    if (cashDrawer && cashDrawer.status === 'open') {
        const save = await deleteMovementRepository(movementId, cashDrawer.id)
        response = save
    } else {
        response.setError('La caja no esta abierta');
    }
    return response;
}

export const getPagedListDrawersService = async (search: SearchPagedListDrawers): Promise<PagedListDrawers> => {
    return await getPagedListDrawersRepository(search)
}
export const getPagedListHistoryDrawersService = async (search: SearchPagedListHistoryDrawers): Promise<PagedListHistoryDrawers> => {
    return await getPagedListHistoryDrawersRepository(search)
}
export const getPagedListExpensesService = async (search: SearchPagedListExpenses): Promise<PagedListExpenses> => {
    return await getPagedListExpensesRepository(search)
}

export const getExpenseFormService = async (): Promise<ExpenseForm> => {
    let response = new ExpenseForm()
    try {
        const [expensesType, paymentMethods] = await Promise.all([
            getExpensesTypeRepository(),
            getPaymentsMethodsFromConfigRepository(),
        ])

        response.ExpensesTypes = expensesType;
        response.PaymentsMethods = paymentMethods;

    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
    return response;
}
export const getCloseDrawerFormService = async (): Promise<CloseDrawerForm> => {
    let response = new CloseDrawerForm()
    try {
        const [drawerOpen, paymentMethods] = await Promise.all([
            getChasDrawerOpenRepository(),
            getPaymentsMethodsFromConfigRepository(),
        ])

        response.Drawer = [{
            DrawerId: drawerOpen.id,
            DrawerStatus: drawerOpen.status,
            DrawerOpenDate: drawerOpen.dateOpen as string,
            DrawerMovements: drawerOpen.movements
        }];
        response.PaymentsMethods = paymentMethods;

    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
    return response;
}

export const getReceiptFormService = async (type: string): Promise<ReceiptForm> => {
    let response = new ReceiptForm()
    try {
        const [personsWhitDebit, paymentMethods] = await Promise.all([
            getPersonWhitDebt(type),
            getPaymentsMethodsFromConfigRepository(),
        ])

        response.PersonsWhitDebit = personsWhitDebit || [];
        response.PaymentsMethods = paymentMethods;

    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
    return response;
}

export const getManualMoveFormService = async (): Promise<ManualMoveForm> => {
    let response = new ManualMoveForm()
    try {
        const paymentMethods = await getPaymentsMethodsFromConfigRepository();
        response.PaymentsMethods = paymentMethods;

    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
    return response;
}

export const closeDrawerService = async (drawerId: string): Promise<ResponseMessages> => {
    return await closeDrawerRepository(drawerId)
}

export const openDrawerService = async (): Promise<OpenDrawerResponse> => {
    let response = new OpenDrawerResponse();
    try {
        const cashDrawer = await getChasDrawerOpenRepository();
        if (cashDrawer.id) {
            response.setError('La caja ya esta abierta');
            return response;
        }
        response.DrawerId = await openDrawerRepository();
    } catch (error: any) {
        response.setError(error.message);
        return response;
    }

    return response;
}

export const getOpenDrawerService = async (): Promise<OpenDrawerResponse> => {
    let response = new OpenDrawerResponse();
    try {
        const cashDrawer = await getChasDrawerOpenRepository();
        if (cashDrawer.id) {
            response.DrawerId = cashDrawer.id
            return response;
        }
        response.setError('La caja no esta abierta');
    } catch (error: any) {
        response.setError(error.message);
        return response;
    }

    return response;
}


