import { format } from "@formkit/tempo";
import { db } from "../../../Firebase/firebase";
import { PaymentMethod } from "../../Drawers/Models/Drawer.models";
import { getCompanyName } from "../../Others/Helpers/getCompanyName";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { getStudentsActives, getStudentsByStatus } from "../../Students/Repository/StudentsRepository"
import { getTeachersActives } from "../../Teachers/Repository/Teachers.repository";
import { Account, EditAccount, GenerateAccount, IAccount, SettleAccount } from "../Models/Accounts.models";
import { ITeachers } from "../../Teachers/Models/Teachers.models";
import { IStudents } from "../../Students/Models/Students.models";
import { v4 as uuidv4 } from 'uuid';
import { getDiscount } from "../Helpers/Accounts.helpers";
import { getStudentsAccountsModel } from "../../../mongo/schemas/studentsAccounts.schema";
import { getTeachersAccountsModel } from "../../../mongo/schemas/teachersAccounts.schema";
import { getTeachersModel } from "../../../mongo/schemas/teachers.schema";


export const getAccountsStudentsActivesRepository = async (): Promise<IAccount[]> => {
    const studentsActives = await getStudentsByStatus('activo');

    if (studentsActives && studentsActives.length > 0) {
        const activeIds = studentsActives.map((s) => s.id);

        // Función para dividir en bloques de 10
        const chunkArray = (array: string[], size: number) => {
            const result = [];
            for (let i = 0; i < array.length; i += size) {
                result.push(array.slice(i, i + size));
            }
            return result;
        };

        const chunks = chunkArray(activeIds, 10);

        // Ejecutar todas las consultas en paralelo
        const accountsChunks = await Promise.all(
            chunks.map(chunk => getStudentsAccountsByPersonIds(chunk))
        );
        // Unir los resultados de cada chunk
        const allAccounts = accountsChunks.flatMap(result => result.Items || []);

        return allAccounts;
    }


    return [];

}

export const getStudentsAccounts = async (): Promise<Account> => {
    const response = new Account();

    try {
        const companyName = getCompanyName();
        if (!companyName) {
            response.setError("Company name is not set");
            return response;
        }

        const StudentsAccountModel = getStudentsAccountsModel(companyName);

        // Obtener todas las cuentas de estudiantes
        const studentsAccountsData = await StudentsAccountModel.find().lean();

        if (!studentsAccountsData || studentsAccountsData.length === 0) {
            response.setWarning("No se encontraron cuentas");
            return response;
        }

        response.Items = studentsAccountsData;
        response.TotalItems = studentsAccountsData.length;

        return response;
    } catch (error: any) {
        console.error("Error obteniendo cuentas de estudiantes:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getTuitionStudentsAccounts = async (
    year: string
): Promise<Account> => {
    const response = new Account();

    try {
        const companyName = getCompanyName();
        if (!companyName) {
            response.setError("Company name is not set");
            return response;
        }

        const StudentsAccountModel = getStudentsAccountsModel(companyName);

        // Construcción dinámica del filtro
        const filter: any = {};
        if (year) {
            filter.year = year;
        }

        // Buscar las cuentas
        let studentsAccountsData = await StudentsAccountModel.find(filter).lean();

        if (!studentsAccountsData || studentsAccountsData.length === 0) {
            response.setWarning("No se encontraron cuentas");
            return response;
        }

        // Filtrar las cuentas que contengan "matricula" en la descripción
        studentsAccountsData = studentsAccountsData.filter((acc) =>
            acc.description?.toLowerCase().includes("matricula")
        );

        response.Items = studentsAccountsData;
        response.TotalItems = studentsAccountsData.length;

        return response;
    } catch (error: any) {
        console.error("Error obteniendo cuentas de alumnos:", error);
        throw new Error("Error interno del servidor");
    }
};



export const getStudentsAccountsByPersonIds = async (personIds: string[]): Promise<Account> => {
    const response = new Account();

    try {
        const companyName = getCompanyName();
        if (!companyName) {
            response.setError("Company name is not set");
            return response;
        }

        // Si el array está vacío, no tiene sentido hacer la consulta
        if (!personIds || personIds.length === 0) {
            response.setWarning("No se proporcionaron IDs de personas");
            return response;
        }

        const StudentsAccountModel = getStudentsAccountsModel(companyName);

        // Consulta a MongoDB: buscar todas las cuentas cuyos idPerson estén en personIds
        const studentsAccountsData = await StudentsAccountModel.find({
            idPerson: { $in: personIds }
        }).lean();

        if (!studentsAccountsData || studentsAccountsData.length === 0) {
            response.setWarning("No se encontraron cuentas");
            return response;
        }

        response.Items = studentsAccountsData;
        response.TotalItems = studentsAccountsData.length;

        return response;
    } catch (error: any) {
        console.error("Error obteniendo cuentas de alumnos:", error);
        throw new Error("Error interno del servidor");
    }
};


export const getPendingStudentsAccounts = async (): Promise<Account> => {
    const response = new Account();

    try {
        const companyName = getCompanyName();
        if (!companyName) {
            response.setError("Company name is not set");
            return response;
        }

        const StudentsAccountModel = getStudentsAccountsModel(companyName);

        // Buscar todas las cuentas con estado "pending"
        const studentsAccountsData = await StudentsAccountModel.find({ status: "pending" }).lean();

        if (!studentsAccountsData || studentsAccountsData.length === 0) {
            response.setWarning("No se encontraron cuentas pendientes");
            return response;
        }

        response.Items = studentsAccountsData;
        response.TotalItems = studentsAccountsData.length;

        return response;
    } catch (error: any) {
        console.error("Error obteniendo cuentas pendientes:", error);
        throw new Error("Error interno del servidor");
    }
};


export const getPendingTeachersAccounts = async (): Promise<Account> => {
    const response = new Account();

    try {
        const companyName = getCompanyName();
        if (!companyName) {
            response.setError("Company name is not set");
            return response;
        }

        const TeachersAccountModel = getTeachersAccountsModel(companyName);

        // Buscar todas las cuentas con estado "pending"
        const teachersAccountsData = await TeachersAccountModel.find({ status: "pending" }).lean();

        if (!teachersAccountsData || teachersAccountsData.length === 0) {
            response.setWarning("No se encontraron cuentas pendientes");
            return response;
        }

        response.Items = teachersAccountsData;
        response.TotalItems = teachersAccountsData.length;

        return response;
    } catch (error: any) {
        console.error("Error obteniendo cuentas de profesores pendientes:", error);
        throw new Error("Error interno del servidor");
    }
};


export const getStudentsAccountsByStatus = async (status: string): Promise<Account> => {
    const response = new Account();

    try {
        const companyName = getCompanyName();
        if (!companyName) {
            response.setError("Company name is not set");
            return response;
        }

        const StudentsAccountModel = getStudentsAccountsModel(companyName);

        // Buscar cuentas por estado (status)
        const studentsAccountsData = await StudentsAccountModel.find({ status }).lean();

        if (!studentsAccountsData || studentsAccountsData.length === 0) {
            response.setWarning("No se encontraron cuentas con el estado especificado");
            return response;
        }

        response.Items = studentsAccountsData;
        response.TotalItems = studentsAccountsData.length;

        return response;
    } catch (error: any) {
        console.error("Error obteniendo cuentas de alumnos por estado:", error);
        throw new Error("Error interno del servidor");
    }
};


export const getAccountsByStudentIdRepository = async (studentId: string): Promise<IAccount[]> => {
    let response: IAccount[] = [];
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const StudentsAccountModel = getStudentsAccountsModel(companyName);

        const accounts = await StudentsAccountModel.find({
            idPerson: studentId,
            status: "pending"
        }).lean();

        if (accounts?.length === 0) {
            throw new Error("No se encontraron cuentas");
        }

        response = accounts;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
    return response;
}

export const getAccountsByTeacherIdRepository = async (teacherId: string): Promise<IAccount[]> => {
    let response: IAccount[] = [];
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const StudentsAccountModel = getTeachersAccountsModel(companyName);

        const accounts = await StudentsAccountModel.find({
            idPerson: teacherId,
            status: "pending"
        }).lean();

        if (accounts?.length === 0) {
            throw new Error("No se encontraron cuentas");
        }

        response = accounts;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
    return response;
}

export const getAccountsTeachersActives = async () => {
    const teachersActives = await getTeachersByStatus('activo');

    if (teachersActives && teachersActives.length > 0) {
        const activeIds = teachersActives.map((s) => s.id);

        // Función para dividir en bloques de 10
        const chunkArray = (array: string[], size: number) => {
            const result = [];
            for (let i = 0; i < array.length; i += size) {
                result.push(array.slice(i, i + size));
            }
            return result;
        };

        const chunks = chunkArray(activeIds, 10);

        // Ejecutar todas las consultas en paralelo
        const accountsChunks = await Promise.all(
            chunks.map(chunk => getTeachersAccountsByPersonIds(chunk))
        );

        // Unir los resultados de cada chunk
        const allAccounts = accountsChunks.flatMap(result => result.Items || []);

        return allAccounts;
    }


    return [];

}

export const getTeachersAccountsByPersonIds = async (personIds: string[]): Promise<Account> => {
    const response = new Account();

    try {
        const companyName = getCompanyName();
        if (!companyName) {
            response.setError("Company name is not set");
            return response;
        }

        // Si el array está vacío, no tiene sentido hacer la consulta
        if (!personIds || personIds.length === 0) {
            response.setWarning("No se proporcionaron IDs de personas");
            return response;
        }

        const TeachersAccountModel = getTeachersAccountsModel(companyName);

        // Consulta a MongoDB: buscar todas las cuentas cuyos idPerson estén en personIds
        const teachersAccountsData = await TeachersAccountModel.find({
            idPerson: { $in: personIds }
        }).lean();

        if (!teachersAccountsData || teachersAccountsData.length === 0) {
            response.setWarning("No se encontraron cuentas");
            return response;
        }

        response.Items = teachersAccountsData;
        response.TotalItems = teachersAccountsData.length;

        return response;
    } catch (error: any) {
        console.error("Error obteniendo cuentas de profesores:", error);
        throw new Error("Error interno del servidor");
    }
};


export const getTeachersByStatus = async (status: string): Promise<ITeachers[]> => {
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const TeachersModel = getTeachersModel(companyName);

        // Buscar todos los profesores con el status indicado
        let teachersByStatus = await TeachersModel.find({ status }).lean();

        if (!teachersByStatus || teachersByStatus.length === 0) {
            return [];
        }

        // Ordenar por nombre
        return teachersByStatus.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error: any) {
        console.error("Error obteniendo profesores:", error);
        throw new Error("Error interno del servidor");
    }
};


export const getTeachersAccounts = async (): Promise<Account> => {
    const response = new Account();

    try {
        const companyName = getCompanyName();
        if (!companyName) {
            response.setError("Company name is not set");
            return response;
        }

        const TeachersAccountsModel = getTeachersAccountsModel(companyName);

        // Obtener todas las cuentas de profesores
        const teachersAccountsData = await TeachersAccountsModel.find().lean();

        if (!teachersAccountsData || teachersAccountsData.length === 0) {
            response.setWarning("No se encontraron cuentas");
            return response;
        }

        response.Items = teachersAccountsData;
        response.TotalItems = teachersAccountsData.length;

        return response;
    } catch (error: any) {
        console.error("Error obteniendo cuentas de profesores:", error);
        throw new Error("Error interno del servidor");
    }
};


export const updateAccountTeacherRepository = async (
    idAccount: string,
    monthly: number,
    type: string
): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) {
            response.setError("Company name is not set");
            return response;
        }

        const TeachersAccountsModel = getTeachersAccountsModel(companyName);

        // Buscar la cuenta por su id
        const currentAccount = await TeachersAccountsModel.findOne({ id: idAccount }).lean();

        if (!currentAccount) {
            response.setWarning("Cuenta no encontrada");
            return response;
        }

        let updatedFields: Partial<IAccount> = {};

        if (type === "increase") {
            updatedFields = {
                amount: currentAccount.amount + monthly,
                balance: currentAccount.balance + monthly,
                increase: (currentAccount.increase || 0) + monthly,
            };
        } else {
            updatedFields = {
                amount: currentAccount.amount - monthly,
                balance: currentAccount.balance - monthly,
                discounts: (currentAccount.discounts || 0) + monthly,
            };
        }

        // Actualizar la cuenta en MongoDB
        await TeachersAccountsModel.findByIdAndUpdate(idAccount, updatedFields);

        response.setSuccess("Cuenta modificada con éxito");
        return response;

    } catch (error: any) {
        console.error("Error actualizando la cuenta:", error);
        response.setError("Error interno del servidor");
        return response;
    }
};


export const getStudentAccountByAccountIdRepository = async (accountId: string): Promise<IAccount> => {
    const companyName = getCompanyName();
    if (!companyName) throw new Error("Company name is not set");

    const StudentsAccountsModel = getStudentsAccountsModel(companyName);

    // Buscar la cuenta por id
    const account = await StudentsAccountsModel.findOne({ id: accountId }).lean();

    if (!account) {
        throw new Error("No se encontró la cuenta");
    }

    return account;
};


export const getTeacherAccountByAccountIdRepository = async (accountId: string): Promise<IAccount> => {
    const companyName = getCompanyName();
    if (!companyName) throw new Error("Company name is not set");

    const TeachersAccountsModel = getTeachersAccountsModel(companyName);

    // Buscar la cuenta por id
    const account = await TeachersAccountsModel.findOne({ id: accountId }).lean();

    if (!account) {
        throw new Error("No se encontró la cuenta");
    }

    return account;
};


export const getAccountByAccountIdAndType = async (accountId: string, type: string): Promise<IAccount> => {
    const companyName = getCompanyName();
    if (!companyName) throw new Error("Company name is not set");

    // Obtener el modelo correspondiente según el tipo
    const AccountModel = type === "teachersAccounts"
        ? getTeachersAccountsModel(companyName)
        : getStudentsAccountsModel(companyName);

    // Buscar la cuenta por id
    const account = await AccountModel.findOne({ id: accountId }).lean();

    if (!account) {
        throw new Error("No se encontró la cuenta");
    }

    return account;
};


export const editAccountRepository = async (editAccount: EditAccount): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        // Obtener el modelo correspondiente según el tipo
        const AccountModel = editAccount.type === "teachersAccounts"
            ? getTeachersAccountsModel(companyName)
            : getStudentsAccountsModel(companyName);

        // Buscar la cuenta por id
        const currentAccount = await AccountModel.findOne({ id: editAccount.accountId }).lean();

        if (!currentAccount) {
            throw new Error("No se encontró la cuenta");
        }

        const totalPaid = currentAccount.paymentsMethods?.reduce((acc, p) => acc + p.value, 0) || 0;

        const isSettleAccount =
            (currentAccount.isPaidWhitEft && editAccount.eftAmount === totalPaid) ||
            (!currentAccount.isPaidWhitEft && editAccount.amount === totalPaid);

        const updatedAccount = {
            amount: editAccount.amount,
            eftAmount: editAccount.eftAmount,
            balance: editAccount.amount - totalPaid,
            eftBalance: editAccount.eftAmount - totalPaid,
            status: isSettleAccount ? "paid" : "pending",
        };

        await AccountModel.updateOne({ id: editAccount.accountId }, { $set: updatedAccount });

        response.setSuccess("Cuenta modificada con éxito");
        return response;

    } catch (error: any) {
        console.error("Error modificando cuenta:", error);
        response.setError(error.message);
        return response;
    }
};

export const updateAccountByEditMovementRepository = async (
    account: IAccount,
    type: string
): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        // Obtener el modelo correspondiente según el tipo
        const AccountModel = type === "teachersAccounts"
            ? getTeachersAccountsModel(companyName)
            : getStudentsAccountsModel(companyName);

        // Verificar que la cuenta exista
        const currentAccount = await AccountModel.findOne({ id: account.id }).lean();
        if (!currentAccount) {
            throw new Error("No se encontró la cuenta");
        }

        // Actualizar solo los campos modificados
        await AccountModel.updateOne({ id: account.id }, { $set: account });

        response.setSuccess("Cuenta modificada con éxito");
        return response;

    } catch (error: any) {
        console.error("Error actualizando cuenta:", error);
        response.setError(error.message);
        return response;
    }
};



export const settleAccountRepository = async (
    currentAccount: IAccount,
    type: string,
    paymentsMethods: PaymentMethod[]
): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        // Obtener el modelo correspondiente según el tipo
        const AccountModel = type === "student"
            ? getStudentsAccountsModel(companyName)
            : getTeachersAccountsModel(companyName);

        // Buscar la cuenta existente
        const accountDoc = await AccountModel.findOne({ id: currentAccount.id }).lean();
        if (!accountDoc) {
            throw new Error("No se encontró la cuenta");
        }

        // Calcular pagos totales
        const currentPaid = paymentsMethods.reduce((acc, item) => acc + item.value, 0);
        const accountPaid = (accountDoc.paymentsMethods || []).reduce((acc, item) => acc + item.value, 0);
        const totalPaid = currentPaid + accountPaid;

        // Merge de métodos de pago
        const mergedPaymentsMethods: PaymentMethod[] = [...(accountDoc.paymentsMethods || [])];
        paymentsMethods.forEach((newPayment) => {
            const existingIndex = mergedPaymentsMethods.findIndex(
                (p) => p.idPayment === newPayment.idPayment
            );
            if (existingIndex !== -1) {
                mergedPaymentsMethods[existingIndex].value += newPayment.value;
            } else {
                mergedPaymentsMethods.push(newPayment);
            }
        });

        const amount = accountDoc.isPaidWhitEft ? accountDoc.eftAmount : accountDoc.amount;
        const status = amount - totalPaid === 0 || amount === 0 ? "paid" : "pending";

        const updatedFields = {
            status,
            balance: amount - totalPaid,
            eftBalance: (accountDoc.eftAmount || 0) - totalPaid,
            paymentsMethods: mergedPaymentsMethods,
            settleDate: new Date(), // Podés formatear con date-fns si querés
            amount: status === "paid" ? amount : accountDoc.amount,
            eftAmount: status === "paid" ? amount : accountDoc.eftAmount,
        };

        // Actualizar solo los campos modificados
        await AccountModel.updateOne({ id: currentAccount.id }, { $set: updatedFields });

        response.setSuccess("Cuenta modificada con éxito");

    } catch (error: any) {
        console.error("Error actualizando cuenta:", error);
        response.setError(error.message);
    }

    return response;
};


export const generateAccountPersonRepository = async (
    person: IStudents | ITeachers,
    type: string,
    regularPrice: number,
    eftPrice: number | null = null,
    desc = ""
): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        // Seleccionar modelo según el tipo
        const AccountModel = type === "studentsAccounts" ? getStudentsAccountsModel(companyName) : getTeachersAccountsModel(companyName);

        const accountId = uuidv4();
        const regularDiscount = getDiscount(person.discount, regularPrice);
        const eftDiscount = getDiscount(person.discount, eftPrice);

        const discountedAmount = regularPrice - (regularDiscount || 0);
        const discountedEftAmount =
            eftPrice != null ? eftPrice - (eftDiscount || 0) : discountedAmount;

        const description =
            desc || (type === "students" ? "Abono mensual" : "Liquidación mensual");

        const newAccount: IAccount = {
            id: accountId,
            idPerson: person.id,
            month,
            year,
            paymentsMethods: [],
            amount: discountedAmount,
            balance: discountedAmount,
            status: "pending",
            settleDate: null,
            description,
            eftAmount: discountedEftAmount,
            eftBalance: discountedEftAmount,
            discounts: 0,
            increase: 0,
            isPaidWhitEft: type === "students" || type === "receipt",
        };

        // Guardar la cuenta usando el modelo Mongo
        const accountDoc = new AccountModel(newAccount);
        await accountDoc.save();

        response.setSuccess("Cuenta creada con éxito");
    } catch (error: any) {
        console.error("Error creando cuenta:", error);
        response.setError(error.message);
    }

    return response;
};



export const generateAccountRepository = async (
    generateAccount: GenerateAccount
): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        // Seleccionar modelo según tipo
        const AccountModel =
            generateAccount.type === 'students' || generateAccount.type === 'receipt'
                ? getStudentsAccountsModel(companyName)
                : getTeachersAccountsModel(companyName);

        const description =
            generateAccount.description ||
            (generateAccount.type === 'students' ? 'Abono mensual' : 'Liquidación mensual');

        const newAccount: IAccount = {
            id: uuidv4(),
            idPerson: generateAccount.personId,
            month,
            year,
            paymentsMethods: [],
            description,
            amount: generateAccount.amount,
            balance: generateAccount.amount,
            eftAmount: generateAccount.eftAmount,
            eftBalance: generateAccount.eftAmount,
            status: 'pending',
            settleDate: null,
            isPaidWhitEft: generateAccount.eftAmount < generateAccount.amount,
            discounts: 0,
            increase: 0,
        };

        // Guardar la cuenta usando el modelo Mongo
        const accountDoc = new AccountModel(newAccount);
        await accountDoc.save();

        response.setSuccess('Cuenta creada con éxito');
    } catch (error: any) {
        console.error("Error creando cuenta:", error);
        response.setError(error.message);
    }

    return response;
};


export const saveAccounts = async (accounts: IAccount[]): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) {
            response.setError("Company name is not set");
            return response;
        }

        const StudentsAccountsModel = getStudentsAccountsModel(companyName);

        // Guardar todas las cuentas (reemplazar existentes o insertarlas)
        await Promise.all(accounts.map((account) =>
            StudentsAccountsModel.findOneAndUpdate(
                { id: account.id },
                { $set: account },
                { upsert: true, new: true }
            )
        ));

        response.setSuccess("Cuentas guardadas con éxito");
    } catch (error: any) {
        console.error("Error guardando cuentas:", error);
        response.setError(error.message);
    }

    return response;
};
