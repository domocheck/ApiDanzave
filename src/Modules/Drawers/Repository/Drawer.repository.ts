import { format } from "@formkit/tempo";
import { db } from "../../../Firebase/firebase";
import { getLimit, getPaymentsMethodsFromConfigRepository } from "../../Config/Repository/Config.repository";
import { getContactByIdRepository, getFullNameContactById } from "../../Contacts/Repository/Contacts.repository";
import { getCompanyName } from "../../Others/Helpers/getCompanyName";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { getFullNameStudentById, getStudentByIdRepository } from "../../Students/Repository/StudentsRepository";
import { getFullNameTeacherById, getTeacherById } from "../../Teachers/Repository/Teachers.repository";
import { IPagedListDrawer, IPagedListMovements, PagedListDrawers, SearchPagedListDrawers } from "../Models/Drawer-paged-list.model";
import { EditMovement, IDrawer, IExpense, IMovement } from "../Models/Drawer.models";
import { v4 as uuidv4 } from 'uuid';
import { IPagedListHistoryDrawer, PagedListHistoryDrawers, SearchPagedListHistoryDrawers } from "../Models/History-drawers-paged-list.model";
import { formatDateToDate, normalizeDate } from "../../Others/Helpers/FormatDateToDate";
import { IPagedListExpense, PagedListExpenses, SearchPagedListExpenses } from "../Models/Expenses.paged-lilst.model";
import { IContacts } from "../../Contacts/Models/Contact.models";
import { IStudents } from "../../Students/Models/Students.models";
import { ITeachers } from "../../Teachers/Models/Teachers.models";
import { getDrawerMovementsModel } from './../../../mongo/schemas/drawersMovements.schema';
import { getDrawersModel } from "../../../mongo/schemas/drawers.schema";


export const getMovementByTypeRepository = async (type: string): Promise<IMovement[]> => {
    let response: IMovement[] = [];
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }

        const movementsModel = getDrawerMovementsModel(companyName);

        const movements = await movementsModel.find({ type });

        if (!movements || movements.length === 0) {
            return response;
        }

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

        const movementsModel = getDrawerMovementsModel(companyName);

        const movements = await movementsModel.find({ personId });

        if (!movements || movements.length === 0) {
            return response;
        }

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

        const movementsModel = getDrawerMovementsModel(companyName);

        const movementsDoc = await movementsModel.find({ accountId });

        if (!movementsDoc || movementsDoc.length === 0) {
            return response;
        }

        const movements: IMovement[] = await Promise.all(
            movementsDoc.map(async (m: IMovement) => ({
                ...m, // si es un documento Mongoose, mejor convertir a objeto plano
                isCashDrawerOpen: await checkIsValidMovement(m.id)
            }))
        );

        return movements;

    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getMovementByCashDrawerIdRepository = async (drawerId: string): Promise<IMovement[]> => {
    let response: IMovement[] = [];
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }

        const movementsModel = getDrawerMovementsModel(companyName);

        const movements = await movementsModel.find({ drawerId });

        if (!movements || movements.length === 0) {
            return response;
        }

        return movements;

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

        const movementsModel = getDrawerMovementsModel(companyName);

        const movement = await movementsModel.findOne({ id: movementId });

        if (!movement) {
            return response;
        }

        let openCashDrawer = await getChasDrawerOpenRepository();

        response = openCashDrawer && openCashDrawer.id === movement.drawerId;
        return response;

    } catch (error: any) {
        throw new Error(error.message);
        return response;
    }

}

export const editMovementRepository = async (
    editMovement: EditMovement
): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const { movementId, amount, balance, paymentsMethods } = editMovement;

        if (!movementId) {
            response.setError("Faltan datos para identificar el movimiento.");
            return response;
        }

        const movementsModel = getDrawerMovementsModel(companyName);

        // Construir los campos a actualizar dinámicamente
        const updateFields: any = {};
        if (amount !== undefined) updateFields.amount = amount;
        if (balance !== undefined) updateFields.balance = balance;
        if (paymentsMethods !== undefined) updateFields.paymentsMethods = paymentsMethods;

        const updatedMovement = await movementsModel.findOneAndUpdate(
            { id: movementId },
            { $set: updateFields },
            { new: true } // devuelve el documento actualizado
        );

        if (!updatedMovement) {
            response.setWarning("Movimiento no encontrado");
            return response;
        }

        response.setSuccess("Movimiento actualizado con éxito");

    } catch (error: any) {
        console.error("Error al editar movimiento:", error);
        response.setError(error.message || "Error interno del servidor");
    }

    return response;
};



export const getChasDrawerOpenRepository = async (): Promise<IDrawer> => {
    let response = {} as IDrawer;
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }

        const drawerModel = getDrawersModel(companyName);

        const drawerOpen = await drawerModel.findOne({ status: "open" });

        if (!drawerOpen) {
            return response;
        }

        response = drawerOpen
        return response;

    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const saveMovementRepository = async (
    movement: IMovement,
    cashDrawerId: string
): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const movementsModel = getDrawerMovementsModel(companyName);

        // Actualizar el drawerId del movimiento
        const updatedMovement = await movementsModel.findOneAndUpdate(
            { id: movement.id },
            { $set: { drawerId: cashDrawerId } },
            { new: true } // devuelve el documento actualizado
        );

        if (!updatedMovement) {
            response.setError("Movimiento no encontrado");
            return response;
        }

        response.setSuccess("Movimiento guardado con éxito");
    } catch (error: any) {
        console.error("Error guardando movimiento:", error);
        response.setError(error.message || "Error interno del servidor");
    }

    return response;
};


export const deleteMovementRepository = async (movementId: string, cashDrawerId: string): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const movementsModel = getDrawerMovementsModel(companyName);

        const result = await movementsModel.findOneAndDelete({ id: movementId, drawerId: cashDrawerId });
        if (!result) {
            response.setError("Movimiento no encontrado");
            return response;
        }

        response.setSuccess("Movimiento eliminado con éxito");
        return response;
    } catch (error: any) {
        console.error("Error eliminando movimiento:", error);
        response.setError(error.message);
    }

    return response;
};


export const getPagedListDrawersRepository = async (search: SearchPagedListDrawers): Promise<PagedListDrawers> => {
    const response = new PagedListDrawers();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const drawersModel = getDrawersModel(companyName);
        const movementsModel = getDrawerMovementsModel(companyName);

        // Obtener drawer específico
        const currentDrawer = await drawersModel.findOne({ id: search.DrawerId });
        if (!currentDrawer) {
            response.setError("No se encontró la caja");
            return response;
        }

        // Filtros de movimientos
        const filter: any = { drawerId: search.DrawerId };
        if (search.Type && search.Type !== 'all') {
            filter.type = search.Type === 'ingresses' ? { $in: ['income', 'receipt'] } : 'expense';
        }

        // Obtener límite y página
        const limit = await getLimit();
        const skip = (search.Page - 1) * limit;

        // Contar total de movimientos
        const totalMovements = await movementsModel.countDocuments(filter);

        // Obtener movimientos paginados
        const movements = await movementsModel
            .find(filter)
            .sort({ date: -1 }) // ordenar por fecha descendente
            .skip(skip)
            .limit(limit)
            .lean(); // lean() devuelve objetos planos, más eficiente que documentos Mongoose

        // Obtener personas asociadas
        const uniquePersonIds = Array.from(new Set(movements.map(m => m.idPerson).filter(Boolean)));
        const personsPromise = uniquePersonIds.map(id => getFullPerson(id!));
        const persons = await Promise.all(personsPromise);

        // Transformar movimientos
        const drawerMovements: IPagedListMovements[] = movements.map(m => {
            const person = persons.find(p => p?.id === m.idPerson);
            return {
                id: m.id,
                status: (m.type === 'income' || m.type === 'receipt') ? 'Ingreso' : 'Egreso',
                description: m.description,
                fullName: person ? `${person.name} ${person.lastName}` : "",
                date: m.date as string,
                amount: m.paymentsMethods?.reduce((acc, p) => acc + p.value, 0) ?? 0
            };
        });

        // Aplicar filtro por nombre si viene
        const paginatedMovements = search.Name
            ? drawerMovements.filter(m => m.fullName.toLowerCase().includes(search.Name.toLowerCase()))
            : drawerMovements;

        const drawer: IPagedListDrawer = {
            DrawerStatus: currentDrawer.status,
            DrawerCloseDate: currentDrawer.dateClose as string || "",
            DrawerOpenDate: currentDrawer.dateOpen as string || "",
            DrawerMovements: movements
        };

        response.Items = paginatedMovements;
        response.TotalItems = totalMovements;
        response.PageSize = limit;
        response.Drawer = drawer;
        response.PaymentsMethods = await getPaymentsMethodsFromConfigRepository();

        return response;

    } catch (error) {
        console.error("Error obteniendo cajas:", error);
        response.setError("Error interno del servidor");
        return response;
    }
};


export const getPagedListHistoryDrawersRepository = async (
    search: SearchPagedListHistoryDrawers
): Promise<PagedListHistoryDrawers> => {
    const response = new PagedListHistoryDrawers();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const drawersModel = getDrawersModel(companyName);

        // Filtros iniciales
        const filter: any = {};
        if (search.Status && search.Status !== 'all') {
            filter.status = search.Status;
        }
        if (search.StartDate && search.EndDate) {
            filter.dateOpen = { $gte: search.StartDate, $lte: search.EndDate };
        }

        // Paginación
        const limit = await getLimit();
        const skip = (search.Page - 1) * limit;

        // Contar total de drawers que cumplen filtro
        const totalDrawers = await drawersModel.countDocuments(filter);

        // Obtener drawers paginados
        const drawersData = await drawersModel
            .find(filter)
            .sort({ dateOpen: -1 }) // ordenar por fecha de apertura descendente
            .skip(skip)
            .limit(limit)
            .lean(); // lean() devuelve objetos planos

        // Obtener info de movimientos de cada drawer
        const historyData: IPagedListHistoryDrawer[] = await Promise.all(
            drawersData.map(async (d) => {
                const movements = await getMovementByCashDrawerIdRepository(d.id);

                const income = movements
                    ?.filter(m => m.type === 'receipt' || m.type === 'income')
                    ?.reduce((acc, p) => acc + (p.paymentsMethods?.reduce((a, pm) => a + pm.value, 0) || 0), 0) || 0;

                const outcome = movements
                    ?.filter(m => m.type !== 'receipt' && m.type !== 'income')
                    ?.reduce((acc, p) => acc + (p.paymentsMethods?.reduce((a, pm) => a + pm.value, 0) || 0), 0) || 0;

                return {
                    id: d.id.toString(),
                    status: d.status,
                    openDate: d.dateOpen as string,
                    closeDate: d.dateClose as string,
                    totalIncome: income,
                    totalOutcome: outcome,
                    total: income - outcome,
                };
            })
        );

        response.Items = historyData;
        response.TotalItems = totalDrawers;
        response.PageSize = limit;

        return response;

    } catch (error: any) {
        console.error("Error obteniendo historial de cajas:", error);
        response.setError("Error interno del servidor");
        return response;
    }
};

export const getPagedListExpensesRepository = async (
    search: SearchPagedListExpenses
): Promise<PagedListExpenses> => {
    const response = new PagedListExpenses();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const movementsModel = getDrawerMovementsModel(companyName);

        // Filtros iniciales
        const filter: any = { type: 'expense' };

        if (search.Type && search.Type !== 'all') {
            filter.description = new RegExp(`^${search.Type}$`, 'i'); // case-insensitive exact match
        }
        if (search.StartDate && search.EndDate) {
            filter.date = { $gte: search.StartDate, $lte: search.EndDate };
        }

        // Paginación
        const limit = await getLimit();
        const skip = (search.Page - 1) * limit;

        // Contar total de gastos
        const totalExpenses = await movementsModel.countDocuments(filter);

        // Obtener movimientos paginados
        const expensesData: IMovement[] = await movementsModel
            .find(filter)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const paymentsConfig = await getPaymentsMethodsFromConfigRepository();

        const paginatedExpenses: IPagedListExpense[] = expensesData.map(d => {
            const total = d.paymentsMethods?.reduce((acc, p) => acc + p.value, 0) || 0;
            const payments = d.paymentsMethods?.map(p => ({
                id: p.idPayment,
                name: paymentsConfig.find(pc => pc.id === p.idPayment)?.name ?? "",
                value: p.value
            })) || [];

            return {
                id: d.id,
                date: d.date as string,
                description: d.description,
                total,
                payments
            };
        });

        // Opciones de filtrado únicas
        const uniqueDescriptions = await movementsModel.distinct('description', filter);
        const filteringOptions = [{ id: 'all', name: 'Todos' }, ...uniqueDescriptions.map(d => ({ id: d, name: d }))];

        // Total de todos los movimientos que cumplen filtro
        const totalAmountAgg = await movementsModel.aggregate([
            { $match: filter },
            { $unwind: '$paymentsMethods' },
            { $group: { _id: null, total: { $sum: '$paymentsMethods.value' } } }
        ]);

        response.Items = paginatedExpenses;
        response.TotalItems = totalExpenses;
        response.PageSize = limit;
        response.Total = totalAmountAgg[0]?.total || 0;
        response.FilteringOptions = filteringOptions;

        return response;

    } catch (error: any) {
        console.error("Error obteniendo gastos:", error);
        response.setError("Error interno del servidor");
        return response;
    }
};


const getFullName = async (personId: string | null): Promise<string> => {
    if (!personId) return "";
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
export const getFullPerson = async (personId: string | null): Promise<IStudents | IContacts | ITeachers | null> => {
    if (!personId) return null;
    let person;
    try {
        person = await getStudentByIdRepository(personId);
        if (!person || Object.keys(person).length === 0) {
            person = await getTeacherById(personId);
        }
        if (!person || Object.keys(person).length === 0) {
            person = await getContactByIdRepository(personId);
        }
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
    return person;
}

export const getExpensesTypeRepository = async (): Promise<IExpense[]> => {
    let response: IExpense[] = [];
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        const expenseMovements = await getMovementByTypeRepository('expense');

        const expensesType: IExpense[] = [];
        expenseMovements?.forEach((movement) => {
            if (movement.type === 'expense') {
                const existsExpense = expensesType.some(
                    (expense) => expense.name === movement.description,
                );
                if (!existsExpense) {
                    expensesType.push({ name: movement.description });
                }
            }
        });
        response = expensesType;
        return response;

    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const closeDrawerRepository = async (drawerId: string): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const drawerModel = getDrawersModel(companyName);

        const updatedDrawer = await drawerModel.findOneAndUpdate(
            { id: drawerId }, // busca por tu campo lógico
            {
                $set: {
                    status: "closed",
                    dateClose: format(new Date(), "full"),
                },
            },
            { new: true } // devuelve el documento actualizado
        );

        if (!updatedDrawer) {
            response.setError("No se encontró la caja a cerrar");
            return response;
        }

        response.setSuccess("Caja cerrada con éxito");
    } catch (error: any) {
        console.error("Error cerrando caja:", error);
        response.setError(error.message);
    }

    return response;
};



export const openDrawerRepository = async (): Promise<string> => {
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const drawersModel = getDrawersModel(companyName);

        const newDrawer = new drawersModel({
            id: uuidv4(),
            dateOpen: format(new Date(), { date: 'full', time: 'short' }),
            dateClose: null,
            status: 'open',
            movements: [],
        });

        newDrawer._id = newDrawer.id;

        await newDrawer.save();

        return newDrawer.id; // o newDrawer.id si tu esquema tiene id
    } catch (error: any) {
        console.error("Error abriendo caja:", error);
        throw new Error(error.message);
    }
};