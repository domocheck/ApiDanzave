import { format } from "@formkit/tempo";
import { db } from "../../../Firebase/firebase";
import { getLimit, getPaymentsMethodsFromConfigRepository } from "../../Config/Repository/Config.repository";
import { getFullNameContactById } from "../../Contacts/Repository/Contacts.repository";
import { getCompanyName } from "../../Others/Helpers/getCompanyName";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { getFullNameStudentById } from "../../Students/Repository/StudentsRepository";
import { getFullNameTeacherById } from "../../Teachers/Repository/Teachers.repository";
import { IPagedListDrawer, IPagedListMovements, PagedListDrawers, SearchPagedListDrawers } from "../Models/Drawer-paged-list.model";
import { EditMovement, IDrawer, IExpense, IMovement } from "../Models/Drawer.models";
import { v4 as uuidv4 } from 'uuid';
import { IPagedListHistoryDrawer, PagedListHistoryDrawers, SearchPagedListHistoryDrawers } from "../Models/History-drawers-paged-list.model";
import { formatDateToDate, normalizeDate } from "../../Others/Helpers/FormatDateToDate";
import { IPagedListExpense, PagedListExpenses, SearchPagedListExpenses } from "../Models/Expenses.paged-lilst.model";


export const getMovementByTypeRepository = async (type: string): Promise<IMovement[]> => {
    let response: IMovement[] = [];
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("drawers");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let movements: IMovement[] = docSnap.data()?.drawers.flatMap((drawer: IDrawer) => drawer.movements ?? [])
            .filter((movement: IMovement) => movement.type === type);

        return movements;

    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getMovementByPersonIdRepository = async (personId: string): Promise<IMovement[]> => {
    let response: IMovement[] = [];
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("drawers");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let movements: IMovement[] = docSnap.data()?.drawers.flatMap((drawer: IDrawer) => drawer.movements ?? [])
            .filter((movement: IMovement) => movement.idPerson === personId);

        return movements;

    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getMovementByAccountIdRepository = async (accountId: string): Promise<IMovement[]> => {
    let response: IMovement[] = [];
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("drawers");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let movements: IMovement[] = await Promise.all(
            docSnap.data()?.drawers
                .flatMap((drawer: IDrawer) => drawer.movements ?? [])
                .filter((movement: IMovement) => movement.idAccount === accountId)
                .map(async (m: IMovement) => ({
                    ...m,
                    isCashDrawerOpen: await checkIsValidMovement(m.id)
                }))
        );

        return movements;

    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getMovementByIdRepository = async (movementId: string): Promise<IMovement> => {
    let response: IMovement = {} as IMovement;
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("drawers");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists || !movementId) {
            return response;
        }

        let movement: IMovement = docSnap.data()?.drawers.flatMap((drawer: IDrawer) => drawer.movements ?? [])
            .filter((movement: IMovement) => movement.idPerson === movementId)[0];

        return movement;

    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const checkIsValidMovement = async (movementId: string): Promise<boolean> => {
    let response = false;
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        const docRef = db.collection(companyName).doc("drawers");

        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let openCashDrawer: IDrawer[] = docSnap.data()?.drawers.filter((d: IDrawer) => d.status === 'open') ?? [];

        response = openCashDrawer.length > 0 && openCashDrawer.some(d => d.movements.some((m: IMovement) => m.id === movementId));
        return response;

    } catch (error: any) {
        throw new Error(error.message);
        return response;
    }

}

export const editMovementRepository = async (editMovement: EditMovement): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        const docRef = db.collection(companyName).doc("drawers");

        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let drawersData: IDrawer[] = docSnap.data()?.drawers ?? [];

        let findMove = null;
        let drawerIndex = -1;
        let moveIndex = -1;

        for (let i = 0; i < drawersData.length; i++) {
            const obj = drawersData[i];
            const index = obj.movements.findIndex((mov) => mov.id === editMovement.movementId);
            if (index !== -1) {
                findMove = obj.movements[index];
                drawerIndex = i;
                moveIndex = index;
                break;
            }
        }

        if (findMove) {
            const newMovement = {
                ...findMove,
                amount: editMovement.amount,
                balance: editMovement.balance,
                paymentsMethods: editMovement.paymentsMethods,
            };

            drawersData[drawerIndex].movements[moveIndex] = newMovement;

            await docRef.update({
                drawers: drawersData,
            });
            response.setSuccess('Movimiento actualizado con exito');
        } else {
            response.setWarning('Movimiento no encontrado');
        }


    } catch (error: any) {
        response.setError(error.message);
        return response;
    }

    return response;
}

export const getChasDrawerOpenRepository = async (): Promise<IDrawer> => {
    let response = {} as IDrawer;
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("drawers");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let drawerOpen: IDrawer = docSnap.data()?.drawers.find((d: IDrawer) => d.status.toLowerCase() === 'open') ?? []
        response = drawerOpen
        return response;

    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const saveMovementRepository = async (movement: IMovement, cashDrawerId: string): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        const docRef = db.collection(companyName).doc("drawers");

        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let drawersData: IDrawer[] = docSnap.data()?.drawers ?? [];
        let currentDrawer = drawersData.find((d: IDrawer) => d.id === cashDrawerId);
        if (currentDrawer) {
            currentDrawer.movements.unshift(movement);
            await docRef.update({
                drawers: drawersData,
            });
            response.setSuccess('Movimiento actualizado con exito');
        } else {
            response.setWarning('Caja no encontrado');
        }
    } catch (error: any) {
        response.setError(error.message);
        return response;
    }

    return response;
}

export const deleteMovementRepository = async (movementId: string, cashDrawerId: string): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        const docRef = db.collection(companyName).doc("drawers");

        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let drawersData: IDrawer[] = docSnap.data()?.drawers ?? [];
        let currentDrawer = drawersData.find((d: IDrawer) => d.id === cashDrawerId);
        if (currentDrawer) {
            const indexCurrentMovement = currentDrawer.movements.findIndex(
                (m: IMovement) => m.id === movementId,
            );
            currentDrawer.movements.splice(indexCurrentMovement, 1);
            await docRef.update({
                drawers: drawersData,
            });
            response.setSuccess('Movimiento eliminado con exito');
        } else {
            response.setWarning('Caja no encontrado');
        }
    } catch (error: any) {
        response.setError(error.message);
        return response;
    }

    return response;
}

export const getPagedListDrawersRepository = async (search: SearchPagedListDrawers): Promise<PagedListDrawers> => {
    const response = new PagedListDrawers();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        const docRef = db.collection(companyName).doc("drawers");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            response.setError("No se encontraron esudiantes");
            return response;
        }

        let drawersData: IDrawer[] = docSnap.data()?.drawers;

        if (!Array.isArray(drawersData)) {
            response.setError("No se encontraron cajas válidas");
            return response;
        }

        const currentDrawer = drawersData.filter(d => d.id === search.DrawerId)[0]
        let drawerMovements: IPagedListMovements[] = await Promise.all(
            currentDrawer.movements.map(async (m) => ({
                id: m.id,
                status: (m.type === 'income' || m.type === 'receipt') ? 'Ingreso' : 'Egreso',
                description: m.description,
                fullName: await getFullName(m.idPerson as string),
                date: m.date as string,
                amount: m.paymentsMethods?.reduce((acc, p) => acc + p.value, 0)
            }))
        );
        const drawer: IPagedListDrawer = {
            DrawerStatus: currentDrawer.status,
            DrawerCloseDate: currentDrawer.dateClose as string || "",
            DrawerOpenDate: currentDrawer.dateOpen as string || "",
            DrawerMovements: currentDrawer.movements || []
        }

        if (search.Type && search.Type !== 'all') {
            if (search.Type === 'ingresses') {
                drawerMovements = drawerMovements.filter(m => m.status === 'Ingreso');
            }
            if (search.Type === 'egresses') {
                drawerMovements = drawerMovements.filter(m => m.status === 'Egreso');
            }
        }

        if (search.Name) {
            drawerMovements = drawerMovements.filter(m => m.fullName.toLowerCase().includes(search.Name.toLowerCase()));
        }

        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedMovements = drawerMovements.slice(startIndex, endIndex);

        response.Items = paginatedMovements;
        response.TotalItems = drawerMovements.length;
        response.PageSize = limit;
        response.Drawer = drawer;
        response.PaymentsMethods = await getPaymentsMethodsFromConfigRepository();
        return response;
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}
export const getPagedListHistoryDrawersRepository = async (search: SearchPagedListHistoryDrawers): Promise<PagedListHistoryDrawers> => {
    const response = new PagedListHistoryDrawers();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        const docRef = db.collection(companyName).doc("drawers");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            response.setError("No se encontraron esudiantes");
            return response;
        }

        let drawersData: IDrawer[] = docSnap.data()?.drawers;

        if (!Array.isArray(drawersData)) {
            response.setError("No se encontraron cajas válidas");
            return response;
        }
        if (search.Status && search.Status !== 'all') {
            drawersData = drawersData.filter(d => d.status === search.Status);
        }

        if (search.StartDate && search.EndDate) {
            drawersData = drawersData.filter(d => {
                const openDateDrawer = normalizeDate(formatDateToDate(d.dateOpen as string));
                return openDateDrawer >= search.StartDate! && openDateDrawer <= search.EndDate!;
            })
        }

        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedHistory: IPagedListHistoryDrawer[] = drawersData.map(d => {
            const income = d.movements?.filter(m => m.type === 'receipt' || m.type === 'income')?.reduce((acc, p) => acc + p.paymentsMethods?.reduce((acc, p) => acc + p.value, 0), 0)
            const outcome = d.movements?.filter(m => m.type !== 'receipt' && m.type !== 'income')?.reduce((acc, p) => acc + p.paymentsMethods?.reduce((acc, p) => acc + p.value, 0), 0)
            return {
                id: d.id,
                status: d.status,
                openDate: d.dateOpen as string,
                closeDate: d.dateClose as string,
                totalIncome: income,
                totalOutcome: outcome,
                total: income - outcome,
            }
        }).slice(startIndex, endIndex);

        response.Items = paginatedHistory;
        response.TotalItems = drawersData.length;
        response.PageSize = limit;
        return response;
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}
export const getPagedListExpensesRepository = async (search: SearchPagedListExpenses): Promise<PagedListExpenses> => {
    const response = new PagedListExpenses();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        const docRef = db.collection(companyName).doc("drawers");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            response.setError("No se encontraron esudiantes");
            return response;
        }

        let expensesData: IMovement[] = docSnap.data()?.drawers.flatMap((drawer: IDrawer) => drawer.movements ?? []).filter((m: IMovement) => m.type === 'expense');

        if (!Array.isArray(expensesData)) {
            response.setError("No se encontraron gastos válidos");
            return response;
        }
        if (search.Type && search.Type !== 'all') {
            expensesData = expensesData.filter(d => d.description.toLowerCase() === search.Type.toLowerCase());
        }

        if (search.StartDate && search.EndDate) {
            expensesData = expensesData.filter(d => {
                const expenseDate = normalizeDate(formatDateToDate(d.date as string));
                console.log({ expenseDate })
                return expenseDate >= search.StartDate! && expenseDate <= search.EndDate!;
            })
        }
        const paymentsConfig = await getPaymentsMethodsFromConfigRepository();
        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedExpenses: IPagedListExpense[] = expensesData.map(d => {
            return {
                id: d.id,
                date: d.date as string,
                description: d.description,
                total: d.paymentsMethods.reduce((acc, p) => acc + p.value, 0),
                payments: d.paymentsMethods.map(p => {
                    return {
                        id: p.idPayment,
                        name: paymentsConfig.find(pc => pc.id === p.idPayment)?.name ?? "",
                        value: p.value
                    }
                })
            }
        }).slice(startIndex, endIndex);

        response.Items = paginatedExpenses;
        response.TotalItems = expensesData.length;
        response.PageSize = limit;
        response.Total = expensesData.reduce((acc, p) => acc + p.paymentsMethods.reduce((acc, p) => acc + p.value, 0), 0);
        response.FilteringOptions = expensesData.map(d => {
            return {
                id: d.description,
                name: d.description
            }
        }).filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
        response.FilteringOptions.unshift({ id: 'all', name: 'Todos' });
        return response;
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}

const getFullName = async (personId: string = ""): Promise<string> => {
    let name = "";
    try {
        name = await getFullNameStudentById(personId);
        if (!name) {
            name = await getFullNameTeacherById(personId);
        }
        if (!name) {
            name = await getFullNameContactById(personId);
        }
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
    return name;
}

export const getExpensesTypeRepository = async (): Promise<IExpense[]> => {
    let response: IExpense[] = [];
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("drawers");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let drawers: IDrawer[] = docSnap.data()?.drawers ?? []
        let expensesType: IExpense[] = [];

        drawers.forEach((drawer) => {
            drawer.movements?.forEach((movement) => {
                if (movement.type === 'expense') {
                    const existsExpense = expensesType.some(
                        (expense) => expense.name === movement.description,
                    );
                    if (!existsExpense) {
                        expensesType.push({ name: movement.description });
                    }
                }
            });
        });
        response = expensesType;
        return response;

    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const closeDrawerRepository = async (drawerId: string): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        const docRef = db.collection(companyName).doc("drawers");

        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let drawersData: IDrawer[] = docSnap.data()?.drawers ?? [];
        let currentDrawer = drawersData.find((d: IDrawer) => d.id === drawerId);
        if (currentDrawer) {
            currentDrawer.status = 'closed';
            currentDrawer.dateClose = format(new Date(), 'full');
            await docRef.update({
                drawers: drawersData,
            });
            response.setSuccess('Movimiento eliminado con exito');
        } else {
            response.setError('Caja no encontrado');
        }
    } catch (error: any) {
        response.setError(error.message);
        return response;
    }

    return response;
}

export const openDrawerRepository = async (): Promise<string> => {
    let response = ""
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        const docRef = db.collection(companyName).doc("drawers");

        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let drawersData: IDrawer[] = docSnap.data()?.drawers ?? [];
        const newDrawer: IDrawer = {
            id: uuidv4(),
            dateOpen: format(new Date(), { date: 'full', time: 'short' }),
            dateClose: null,
            status: 'open',
            movements: [],
        };
        drawersData.unshift(newDrawer);
        await docRef.update({
            drawers: drawersData,
        });
        response = newDrawer.id

    } catch (error: any) {
        throw new Error(error.message);
    }

    return response;
}