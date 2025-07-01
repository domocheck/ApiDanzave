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


export const getAccountsStudentsActivesRepository = async (): Promise<IAccount[]> => {
    const studentsActives = await getStudentsByStatus('activo');
    if (studentsActives && studentsActives.length > 0) {
        const activeIds = studentsActives.map((s) => s.id); // Extraer los IDs de los estudiantes activos
        return (await getStudentsAccounts()).Items.filter((account) => activeIds.includes(account.idPerson)); // Filtrar cuentas por ID
    }

    return [];

}

export const getStudentsAccounts = async (): Promise<Account> => {
    let response = new Account();
    try {
        const companyName = getCompanyName();
        if (!companyName) response.setError("Company name is not set");

        // Referencia al documento "accounts"
        const docRef = db.collection(companyName).doc("studentsAccounts");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            response.setError("No se encontraron cuentas");
            return response;
        }

        // Obtener solo la propiedad 'studentsAccounts' del documento
        const studentsAccountsData = docSnap.data()?.studentsAccounts ?? [];

        // Filtrar directamente mientras se asigna a response.Items
        response.Items = studentsAccountsData;
        response.TotalItems = response.Items.length;

        return response;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getStudentsAccountsByStatus = async (status: string): Promise<Account> => {
    let response = new Account();
    try {
        const companyName = getCompanyName();
        if (!companyName) response.setError("Company name is not set");

        // Referencia al documento "accounts"
        const docRef = db.collection(companyName).doc("studentsAccounts");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            response.setError("No se encontraron cuentas");
            return response;
        }

        // Obtener solo la propiedad 'studentsAccounts' del documento
        const studentsAccountsData: IAccount[] = docSnap.data()?.studentsAccounts.filter((a: IAccount) => a.status === status) ?? [];

        // Filtrar directamente mientras se asigna a response.Items
        response.Items = studentsAccountsData;
        response.TotalItems = response.Items.length;

        return response;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getAccountsByStudentIdRepository = async (studentId: string): Promise<IAccount[]> => {
    let response: IAccount[] = [];
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        // Referencia al documento "accounts"
        const docRef = db.collection(companyName).doc("studentsAccounts");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontraron cuentas");
        }

        // Obtener solo la propiedad 'studentsAccounts' del documento
        const studentsAccountsData: IAccount[] = docSnap.data()?.studentsAccounts ?? [];

        const studentAccounts = studentsAccountsData.filter((account: IAccount) => account.idPerson === studentId);

        response = studentAccounts;
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

        // Referencia al documento "accounts"
        const docRef = db.collection(companyName).doc("teachersAccounts");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontraron cuentas");
        }

        // Obtener solo la propiedad 'teachersAccounts' del documento
        const teachersAccountsData: IAccount[] = docSnap.data()?.teachersAccounts ?? [];

        const teachersAccounts = teachersAccountsData.filter((account: IAccount) => account.idPerson === teacherId);

        response = teachersAccounts;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
    return response;
}

export const getAccountsTeachersActives = async () => {
    const teachersActives = await getTeachersActives();
    if (teachersActives && teachersActives.length > 0) {
        const activeIds = teachersActives.map((s) => s.id); // Extraer los IDs de los estudiantes activos
        return (await getTeachersAccounts()).Items.filter((account) => activeIds.includes(account.idPerson)); // Filtrar cuentas por ID
    }

    return [];

}

export const getTeachersByStatus = async (status: string): Promise<ITeachers[]> => {
    let teachersByStatus = [] as ITeachers[];
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("teachers");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        const teachers = docSnap.data()?.teachers ?? [];

        teachersByStatus = teachers.filter((s: ITeachers) => s.status === status);

        return teachersByStatus.sort((a, b) => a.name.localeCompare(b.name))
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getTeachersAccounts = async (): Promise<Account> => {
    let response = new Account();
    try {
        const companyName = getCompanyName();
        if (!companyName) response.setError("Company name is not set");

        // Referencia al documento "accounts"
        const docRef = db.collection(companyName).doc("teachersAccounts");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            response.setError("No se encontraron cuentas");
            return response;
        }

        // Obtener solo la propiedad 'teachersAccounts' del documento
        const teachersAccountsData = docSnap.data()?.teachersAccounts ?? [];

        // Filtrar directamente mientras se asigna a response.Items
        response.Items = teachersAccountsData;
        response.TotalItems = response.Items.length;

        return response;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const updateAccountTeacherRepository = async (idAccount: string, monthly: number, type: string): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) response.setError("Company name is not set");

        // Referencia al documento "accounts"
        const docRef = db.collection(companyName).doc("teachersAccounts");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            response.setError("No se encontraron cuentas");
            return response;
        }

        // Obtener solo la propiedad 'teachersAccounts' del documento
        const teachersAccountsData: IAccount[] = docSnap.data()?.teachersAccounts ?? [];

        let currentAccount = teachersAccountsData.filter((a) => a.id === idAccount)[0];
        let updatedAccount;

        if (type === 'increase') {
            updatedAccount = {
                ...currentAccount,
                amount: currentAccount.amount + monthly,
                balance: currentAccount.balance + monthly,
                increase: monthly + (currentAccount.increase || 0),
            };
        } else {
            updatedAccount = {
                ...currentAccount,
                amount: currentAccount.amount - monthly,
                balance: currentAccount.balance - monthly,
                discounts: monthly + (currentAccount.discounts || 0),
            };
        }

        const index = teachersAccountsData.findIndex((account: IAccount) => account.id === currentAccount.id);
        teachersAccountsData[index] = updatedAccount;

        docRef.update({
            teachersAccounts: teachersAccountsData,
        }).then(() => {
            response.setSuccess('Cuenta modificada con exito');
            return response;
        }).catch((error) => {
            console.error("Error obteniendo cuentas:", error);
            response.setError("Error interno del servidor");
        });
        return response;
    } catch (error) {
        console.error("Error obteniendo cuentas:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}

export const getStudentAccountByAccountIdRepository = async (accountId: string): Promise<IAccount> => {
    let response = {} as IAccount;
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("studentsAccounts");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontraron cuentas");
        }

        const studentsAccountsData: IAccount[] = docSnap.data()?.studentsAccounts ?? [];

        const account = studentsAccountsData.filter(a => a.id === accountId)[0];

        response = account;

        return response;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getTeacherAccountByAccountIdRepository = async (accountId: string): Promise<IAccount> => {
    let response = {} as IAccount;
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("teachersAccounts");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontraron cuentas");
        }

        const teachersAccountsData: IAccount[] = docSnap.data()?.teachersAccounts ?? [];

        const account = teachersAccountsData.filter(a => a.id === accountId)[0];

        response = account;

        return response;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getAccountByAccountIdAndType = async (accountId: string, type: string): Promise<IAccount> => {

    let response = {} as IAccount;
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc(type);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontraron cuentas");
        }

        const accountsData: IAccount[] = docSnap.data()?.[type] ?? [];
        let currentAccount = accountsData.filter((a) => a.id === accountId)[0];

        response = currentAccount
    } catch (error: any) {
        throw new Error(error.message);
    }
    return response;
}

export const editAccountRepository = async (editAccount: EditAccount): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc(editAccount.type);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontraron cuentas");
        }

        const accountsData: IAccount[] = docSnap.data()?.[editAccount.type] ?? [];
        let currentAccount = accountsData.filter((a) => a.id === editAccount.accountId)[0];
        let updatedAccount;

        const totalPaid = currentAccount.paymentsMethods.reduce((acc, p) => acc + p.value, 0);

        let isSettleAccount = false;

        if (
            (currentAccount.isPaidWhitEft && editAccount.eftAmount === totalPaid) ||
            (!currentAccount.isPaidWhitEft && editAccount.amount === totalPaid)
        ) {
            isSettleAccount = true;
        }

        updatedAccount = {
            ...currentAccount,
            amount: editAccount.amount,
            eftAmount: editAccount.eftAmount,
            balance: editAccount.amount - totalPaid,
            eftBalance: editAccount.eftAmount - totalPaid,
            status: isSettleAccount ? 'paid' : 'pending',
        };

        const index = accountsData.findIndex((account: IAccount) => account.id === currentAccount.id);
        accountsData[index] = updatedAccount;

        await docRef.update({
            [editAccount.type]: accountsData,
        });

        response.setSuccess('Cuenta modificada con exito');
        return response;
    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
}

export const updateAccountByEditMovementRepository = async (account: IAccount, type: string): Promise<ResponseMessages> => {

    let response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc(type);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontraron cuentas");
        }

        const accountsData: IAccount[] = docSnap.data()?.[type] ?? [];
        let currentAccount = accountsData.filter((a) => a.id === account.id)[0];

        const index = accountsData.findIndex((account: IAccount) => account.id === currentAccount.id);
        accountsData[index] = account;

        await docRef.update({
            [type]: accountsData
        })
        response.setSuccess('Cuenta modificada con exito');
    } catch (error: any) {
        response.setError(error.message);
        return response
    }
    return response;
}

export const settleAccountRepository = async (currentAccount: IAccount, type: string, paymentsMethods: PaymentMethod[]): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");
        const referenceSearch =
            type === 'student' || type === 'receipt' ? 'studentsAccounts' : 'teachersAccounts';

        const docRef = db.collection(companyName).doc(referenceSearch);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontraron cuentas");
        }

        const accountsData: IAccount[] = docSnap.data()?.[referenceSearch] ?? [];
        if (currentAccount) {
            //10000
            const currentPaid = paymentsMethods.reduce((acc, item) => acc + item.value, 0); // 5000
            const accountPaid = currentAccount.paymentsMethods.reduce(
                (acc, item) => acc + item.value,
                0,
            ); // 5000;
            const totalPaid = currentPaid + accountPaid; // 10000;

            const mergedPaymentsMethods = [...currentAccount.paymentsMethods];

            paymentsMethods.forEach((newPayment) => {
                const existingPaymentIndex = mergedPaymentsMethods.findIndex(
                    (payment) => payment.idPayment === newPayment.idPayment,
                );

                if (existingPaymentIndex !== -1) {
                    // Si el método de pago ya existe, actualiza su valor
                    mergedPaymentsMethods[existingPaymentIndex].value += newPayment.value;
                } else {
                    // Si es un método de pago nuevo, agrégalo
                    mergedPaymentsMethods.push(newPayment);
                }
            });

            const amount = currentAccount.isPaidWhitEft ? currentAccount.eftAmount : currentAccount.amount;
            const status = amount - totalPaid === 0 || amount === 0 ? 'paid' : 'pending';

            const updatedAccount = {
                ...currentAccount,
                status,// paid
                balance: amount - totalPaid,
                eftBalance: currentAccount.eftAmount - totalPaid,
                paymentsMethods: mergedPaymentsMethods,
                settleDate: format(new Date(), 'full'),
                amount: status === 'paid' ? amount : currentAccount.amount,
                eftAmount: status === 'paid' ? amount : currentAccount.eftAmount,
            };

            // Encontrar y actualizar el índice de currentAccount en el array accounts
            const index = accountsData.findIndex((account: IAccount) => account.id === currentAccount.id);
            accountsData[index] = updatedAccount;
            await docRef.update({
                [referenceSearch]: accountsData,
            });

            response.setSuccess('Cuenta modificada con exito');
        }
        else {
            response.setWarning('No se encontraron cuentas');
        }
    }
    catch (error: any) {
        response.setError(error.message);
        return response;
    }
    return response;

}

export const generateAccountPersonRepository = async (
    person: IStudents | ITeachers,
    type: string,
    regularPrice: number,
    eftPrice: null | number = null,
    desc = ""
): Promise<ResponseMessages> => {
    let response = new ResponseMessages()
    const referenceSearch =
        type === 'students' || type === 'receipt' ? 'studentsAccounts' : 'teachersAccounts';
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc(referenceSearch);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontraron cuentas");
        }

        const accountsData: IAccount[] = docSnap.data()?.[referenceSearch] ?? [];
        const regularDiscount = getDiscount(person.discount, regularPrice);
        const eftDiscount = getDiscount(person.discount, eftPrice);
        const description = desc || (type === 'students' ? 'Abono mensual' : 'Liquidacion mensual');

        const newAccount = {
            id: uuidv4(),
            idPerson: person.id,
            month,
            year,
            paymentsMethods: [],
            amount: regularPrice - (regularDiscount ? +regularDiscount : 0),
            balance: regularPrice - (regularDiscount ? +regularDiscount : 0),
            status: 'pending',
            settleDate: null,
            description,
            eftBalance: eftPrice
                ? eftPrice - (eftDiscount ? +eftDiscount : 0)
                : regularPrice - (regularDiscount ? +regularDiscount : 0),
            eftAmount: eftPrice
                ? eftPrice - (eftDiscount ? +eftDiscount : 0)
                : regularPrice - (regularDiscount ? +regularDiscount : 0),
            discounts: 0,
            increase: 0,
            isPaidWhitEft: type === 'students' || type === 'receipt' ? true : false,
        };

        accountsData.push(newAccount);

        await docRef.update({
            [referenceSearch]: accountsData,
        });

        response.setSuccess('Cuenta creada con exito');
    } catch (error: any) {
        response.setError(error.message);
        return response
    }
    return response;
}

export const generateAccountRepository = async (
    generateAccount: GenerateAccount
): Promise<ResponseMessages> => {
    let response = new ResponseMessages()
    const referenceSearch =
        generateAccount.type === 'students' || generateAccount.type === 'receipt' ? 'studentsAccounts' : 'teachersAccounts';
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc(referenceSearch);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontraron cuentas");
        }

        const accountsData: IAccount[] = docSnap.data()?.[referenceSearch] ?? [];
        const description = generateAccount.description || (generateAccount.type === 'students' ? 'Abono mensual' : 'Liquidacion mensual');

        const newAccount = {
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
        };

        accountsData.push(newAccount);
        console.log(newAccount)

        await docRef.update({
            [referenceSearch]: accountsData,
        });

        response.setSuccess('Cuenta creada con exito');
    } catch (error: any) {
        response.setError(error.message);
        return response
    }
    return response;
}

export const saveAccounts = async (accounts: IAccount[]): Promise<ResponseMessages> => {

    let response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc('studentsAccounts');
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontraron cuentas");
        }

        await docRef.update({
            studentsAccounts: accounts
        })
        console.log('Cuenta modificada con exito');
    } catch (error: any) {
        response.setError(error.message);
        return response
    }
    return response;
}