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


export const getMovementByTypeRepository = async (type: string): Promise<IMovement[]> => {
    let response: IMovement[] = [];
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("drawers").collection("movements")
            .where("type", "==", type);

        // Obtener el documento
        const docSnap = await docRef.get();

        if (docSnap.empty) {
            return response;
        }

        let movements: IMovement[] = docSnap.docs.map((doc) => doc.data() as IMovement) ?? [];

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
        const docRef = db.collection(companyName).doc("drawers").collection("movements")
            .where("idPerson", "==", personId);

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.empty) {
            return response;
        }

        let movements: IMovement[] = docSnap.docs.map((doc) => doc.data() as IMovement) ?? [];

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
        const docRef = db.collection(companyName).doc("drawers").collection("movements")
            .where("idAccount", "==", accountId);

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.empty) {
            return response;
        }

        let movements: IMovement[] = docSnap.docs.map((doc) => doc.data().map(async (m: IMovement) => ({
            ...m,
            isCashDrawerOpen: await checkIsValidMovement(m.id)
        })) as IMovement) ?? [];

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
        const docRef = db.collection(companyName).doc("drawers").collection("movements")
            .where("drawerId", "==", drawerId);

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.empty) {
            return response;
        }

        return docSnap.docs.map((doc) => doc.data() as IMovement);

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
        const docRef = db.collection(companyName).doc("drawers").collection("movements")
            .where("id", "==", movementId);

        const docSnap = await docRef.get();

        if (docSnap.empty) {
            return response;
        }

        let openCashDrawer = await getChasDrawerOpenRepository();

        response = openCashDrawer && openCashDrawer.id === docSnap.docs.map((doc) => doc.data().cashDrawerId)[0];
        return response;

    } catch (error: any) {
        throw new Error(error.message);
        return response;
    }

}

export const editMovementRepository = async (editMovement: EditMovement): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const { drawerId, movementId, amount, balance, paymentsMethods } = editMovement;

        if (!drawerId || !movementId) {
            response.setError("Faltan datos para identificar el movimiento.");
            return response;
        }

        const movementRef = db
            .collection(companyName)
            .doc("drawers")
            .collection("movements")
            .doc(movementId);

        const movementSnap = await movementRef.get();

        if (!movementSnap.exists) {
            response.setWarning("Movimiento no encontrado");
            return response;
        }

        // Actualizamos solo los campos que cambiaron
        await movementRef.update({
            amount,
            balance,
            paymentsMethods
        });

        response.setSuccess("Movimiento actualizado con éxito");

    } catch (error: any) {
        console.error("Error al editar movimiento:", error);
        response.setError(error.message);
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
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("drawers").collection("drawers").where("status", "==", "open");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (docSnap.empty) {
            return response;
        }

        let drawerOpen: IDrawer = docSnap.docs.map((doc) => doc.data() as IDrawer)[0]
        response = drawerOpen
        return response;

    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const saveMovementRepository = async (movement: IMovement, cashDrawerId: string): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        // Referencia al nuevo documento del movimiento dentro de la subcolección
        const movementRef = db
            .collection(companyName)
            .doc("drawers")
            .collection("movements")
            .doc(movement.id); // Asegúrate de que movement.id esté definido y sea único

        movement.drawerId = cashDrawerId;

        await movementRef.set(movement);

        response.setSuccess("Movimiento guardado con éxito");
    } catch (error: any) {
        console.error("Error guardando movimiento:", error);
        response.setError(error.message);
    }

    return response;
};


export const deleteMovementRepository = async (movementId: string, cashDrawerId: string): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const movementDocRef = db
            .collection(companyName)
            .doc("drawers")
            .collection("movements")
            .doc(movementId);

        const docSnap = await movementDocRef.get();

        if (!docSnap.exists) {
            response.setWarning("Movimiento no encontrado");
            return response;
        }

        await movementDocRef.delete();

        response.setSuccess("Movimiento eliminado con éxito");
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

        // Obtener drawer específico
        const drawerDocRef = db.collection(companyName).doc("drawers").collection("drawers").doc(search.DrawerId);
        const drawerDocSnap = await drawerDocRef.get();

        if (!drawerDocSnap.exists) {
            response.setError("No se encontró la caja");
            return response;
        }

        const currentDrawer: IDrawer = drawerDocSnap.data() as IDrawer;

        // Obtener movimientos desde la subcolección 'movements'
        const movementsRef = db.collection(companyName).doc("drawers").collection("movements").where("drawerId", "==", search.DrawerId);
        const movementsSnap = await movementsRef.get();
        const movements = movementsSnap.docs.map((doc) => doc.data() as IMovement);

        let uniquePersonIds = Array.from(new Set(movements.map((m) => m.idPerson)));
        let personsPromise = uniquePersonIds.map(async (id) => await getFullPerson(id));
        let persons = await Promise.all(personsPromise);

        let drawerMovements: IPagedListMovements[] = await Promise.all(
            movements.map((m) => {
                const person = persons.find((p) => p?.id === m.idPerson)!;
                return {
                    id: m.id,
                    status: (m.type === 'income' || m.type === 'receipt') ? 'Ingreso' : 'Egreso',
                    description: m.description,
                    fullName: `${person?.name} ${person?.lastName}`,
                    date: m.date as string,
                    amount: m.paymentsMethods?.reduce((acc, p) => acc + p.value, 0)
                };
            })
        );

        const drawer: IPagedListDrawer = {
            DrawerStatus: currentDrawer.status,
            DrawerCloseDate: currentDrawer.dateClose as string || "",
            DrawerOpenDate: currentDrawer.dateOpen as string || "",
            DrawerMovements: [] // Movimientos ya están separados ahora
        };

        // Aplicar filtros
        if (search.Type && search.Type !== 'all') {
            if (search.Type === 'ingresses') {
                drawerMovements = drawerMovements.filter(m => m.status === 'Ingreso');
            }
            if (search.Type === 'egresses') {
                drawerMovements = drawerMovements.filter(m => m.status === 'Egreso');
            }
        }

        if (search.Name) {
            drawerMovements = drawerMovements.filter(m =>
                m.fullName.toLowerCase().includes(search.Name.toLowerCase())
            );
        }

        // Paginación manual
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
};

export const getPagedListHistoryDrawersRepository = async (search: SearchPagedListHistoryDrawers): Promise<PagedListHistoryDrawers> => {
    const response = new PagedListHistoryDrawers();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("drawers").collection("drawers");
        const docSnap = await docRef.get();

        if (docSnap.empty) {
            response.setWarning("No se encontraron estudiantes");
            return response;
        }

        let drawersData: IDrawer[] = docSnap.docs.map((doc) => doc.data() as IDrawer);

        if (!Array.isArray(drawersData)) {
            response.setWarning("No se encontraron cajas válidas");
            return response;
        }

        // Filtros por estado
        if (search.Status && search.Status !== 'all') {
            drawersData = drawersData.filter(d => d.status === search.Status);
        }

        // Filtros por fecha
        if (search.StartDate && search.EndDate) {
            drawersData = drawersData.filter(d => {
                const openDateDrawer = normalizeDate(formatDateToDate(d.dateOpen as string));
                return openDateDrawer >= search.StartDate! && openDateDrawer <= search.EndDate!;
            });
        }

        // Obtener info de cada drawer (asincrónicamente)
        const historyData: IPagedListHistoryDrawer[] = await Promise.all(
            drawersData.map(async (d) => {
                const movements = await getMovementByCashDrawerIdRepository(d.id);

                const income = movements
                    ?.filter(m => m.type === 'receipt' || m.type === 'income')
                    ?.reduce((acc, p) => acc + p.paymentsMethods?.reduce((acc, p) => acc + p.value, 0), 0) || 0;

                const outcome = movements
                    ?.filter(m => m.type !== 'receipt' && m.type !== 'income')
                    ?.reduce((acc, p) => acc + p.paymentsMethods?.reduce((acc, p) => acc + p.value, 0), 0) || 0;

                return {
                    id: d.id,
                    status: d.status,
                    openDate: d.dateOpen as string,
                    closeDate: d.dateClose as string,
                    totalIncome: income,
                    totalOutcome: outcome,
                    total: income - outcome,
                };
            })
        );

        // Paginación después de Promise.all
        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        response.Items = historyData.slice(startIndex, endIndex);
        response.TotalItems = historyData.length;
        response.PageSize = limit;

        return response;

    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
        return response;
    }
};

export const getPagedListExpensesRepository = async (search: SearchPagedListExpenses): Promise<PagedListExpenses> => {
    const response = new PagedListExpenses();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }

        let expensesData: IMovement[] = await getMovementByTypeRepository('expense');

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
        if (!person) {
            person = await getTeacherById(personId);
        }
        if (!person) {
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
    let response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const querySnapshot = await db
            .collection(companyName)
            .doc("drawers")
            .collection("drawers")
            .where("id", "==", drawerId)
            .get();

        if (querySnapshot.empty) {
            response.setError("Caja no encontrada");
            return response;
        }

        const drawerDoc = querySnapshot.docs[0]; // obtenemos el documento
        const drawerRef = drawerDoc.ref;

        await drawerRef.update({
            status: 'closed',
            dateClose: format(new Date(), 'full')
        });

        response.setSuccess("Caja cerrada con éxito");
    } catch (error: any) {
        response.setError(error.message);
    }

    return response;
};


export const openDrawerRepository = async (): Promise<string> => {
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const drawersCollection = db.collection(companyName).doc("drawers").collection("drawers");

        const newDrawer: IDrawer = {
            id: uuidv4(),
            dateOpen: format(new Date(), { date: 'full', time: 'short' }),
            dateClose: null,
            status: 'open',
            movements: [],
        };

        await drawersCollection.doc(newDrawer.id).set(newDrawer);

        return newDrawer.id;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
