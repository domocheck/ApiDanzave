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
    let response = new Account();
    try {
        const companyName = getCompanyName();
        if (!companyName) response.setError("Company name is not set");

        // Referencia al documento "accounts"
        const docRef = db.collection(companyName).doc("studentsAccounts").collection("accounts");
        const docSnap = await docRef.get();

        if (docSnap.empty) {
            response.setWarning("No se encontraron cuentas");
            return response;
        }

        // Obtener solo la propiedad 'studentsAccounts' del documento
        const studentsAccountsData = docSnap.docs.map((doc) => doc.data() as IAccount) ?? [];

        // Filtrar directamente mientras se asigna a response.Items
        response.Items = studentsAccountsData;
        response.TotalItems = response.Items.length;

        return response;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getTuitionStudentsAccounts = async (
    year: string
): Promise<Account> => {
    let response = new Account();
    try {
        const companyName = getCompanyName();
        if (!companyName) {
            response.setError("Company name is not set");
            return response;
        }

        let query = db
            .collection(companyName)
            .doc("studentsAccounts")
            .collection("accounts") as FirebaseFirestore.Query;

        if (year) {
            query = query.where("year", "==", year);
        }

        const docSnap = await query.get();

        if (docSnap.empty) {
            response.setWarning("No se encontraron cuentas");
            return response;
        }

        // Mapear los resultados
        let studentsAccountsData = docSnap.docs.map((doc) => doc.data() as IAccount);

        // Filtro adicional (no indexable) como `description.includes`
        studentsAccountsData = studentsAccountsData.filter((acc) =>
            acc.description?.toLowerCase().includes('matricula')
        );

        response.Items = studentsAccountsData;
        response.TotalItems = studentsAccountsData.length;

        return response;
    } catch (error) {
        console.error("Error obteniendo cuentas de alumnos:", error);
        throw new Error("Error interno del servidor");
    }
};


export const getStudentsAccountsByPersonIds = async (personIds: string[]): Promise<Account> => {
    let response = new Account();
    try {
        const companyName = getCompanyName();
        if (!companyName) response.setError("Company name is not set");
        // Referencia al documento "accounts"
        const docRef = db.collection(companyName).doc("studentsAccounts").collection("accounts")
            .where("idPerson", "in", personIds);
        const docSnap = await docRef.get();

        if (docSnap.empty) {
            response.setWarning("No se encontraron cuentas");
            return response;
        }

        // Obtener solo la propiedad 'studentsAccounts' del documento
        const studentsAccountsData = docSnap.docs.map((doc) => doc.data() as IAccount) ?? [];

        // Filtrar directamente mientras se asigna a response.Items
        response.Items = studentsAccountsData;
        response.TotalItems = response.Items.length;

        return response;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getPendingStudentsAccounts = async (): Promise<Account> => {
    let response = new Account();
    try {
        const companyName = getCompanyName();
        if (!companyName) response.setError("Company name is not set");

        // Referencia al documento "accounts"
        const docRef = db.collection(companyName).doc("studentsAccounts").collection("accounts").where("status", "==", "pending");
        const docSnap = await docRef.get();

        if (docSnap.empty) {
            response.setWarning("No se encontraron cuentas");
            return response;
        }

        // Obtener solo la propiedad 'studentsAccounts' del documento
        const studentsAccountsData = docSnap.docs.map((doc) => doc.data() as IAccount) ?? [];

        // Filtrar directamente mientras se asigna a response.Items
        response.Items = studentsAccountsData;
        response.TotalItems = response.Items.length;

        return response;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getPendingTeachersAccounts = async (): Promise<Account> => {
    let response = new Account();
    try {
        const companyName = getCompanyName();
        if (!companyName) response.setError("Company name is not set");

        // Referencia al documento "accounts"
        const docRef = db.collection(companyName).doc("teachersAccounts").collection("accounts").where("status", "==", "pending");
        const docSnap = await docRef.get();

        if (docSnap.empty) {
            response.setWarning("No se encontraron cuentas");
            return response;
        }

        // Obtener solo la propiedad 'studentsAccounts' del documento
        const studentsAccountsData = docSnap.docs.map((doc) => doc.data() as IAccount) ?? [];

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
        const docRef = db.collection(companyName).doc("studentsAccounts").collection("accounts")
            .where("status", "==", status);

        const docSnap = await docRef.get();

        if (docSnap.empty) {
            response.setWarning("No se encontraron cuentas");
            return response;
        }

        // Obtener solo la propiedad 'studentsAccounts' del documento
        const studentsAccountsData: IAccount[] = docSnap.docs.map((doc) => doc.data() as IAccount) ?? [];

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
        const docRef = db.collection(companyName)
            .doc("studentsAccounts")
            .collection("accounts")
            .where("idPerson", "==", studentId)
            .where("status", "==", "pending");

        const docSnap = await docRef.get();

        if (docSnap.empty) {
            throw new Error("No se encontraron cuentas");
        }

        // Obtener solo la propiedad 'studentsAccounts' del documento
        const studentsAccountsData: IAccount[] = docSnap.docs.map((doc) => doc.data() as IAccount) ?? [];


        response = studentsAccountsData;
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
        const docRef = db.collection(companyName).doc("teachersAccounts").collection("accounts")
            .where("idPerson", "==", teacherId)
            .where("status", "==", "pending");;

        const docSnap = await docRef.get();

        if (docSnap.empty) {
            throw new Error("No se encontraron cuentas");
        }

        // Obtener solo la propiedad 'teachersAccounts' del documento
        const teachersAccountsData: IAccount[] = docSnap.docs.map((doc) => doc.data() as IAccount) ?? [];

        const teachersAccounts = teachersAccountsData;

        response = teachersAccounts;
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
    let response = new Account();
    try {
        const companyName = getCompanyName();
        if (!companyName) response.setError("Company name is not set");

        // Referencia al documento "accounts"
        const docRef = db.collection(companyName).doc("teachersAccounts").collection("accounts")
            .where("idPerson", "in", personIds);
        const docSnap = await docRef.get();

        if (docSnap.empty) {
            response.setWarning("No se encontraron cuentas");
            return response;
        }

        // Obtener solo la propiedad 'studentsAccounts' del documento
        const studentsAccountsData = docSnap.docs.map((doc) => doc.data() as IAccount) ?? [];

        // Filtrar directamente mientras se asigna a response.Items
        response.Items = studentsAccountsData;
        response.TotalItems = response.Items.length;

        return response;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getTeachersByStatus = async (status: string): Promise<ITeachers[]> => {
    let teachersByStatus = [] as ITeachers[];
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("teachers").collection("teachers").where("status", "==", status);
        const docSnap = await docRef.get();

        if (docSnap.empty) {
            return teachersByStatus;
        }

        teachersByStatus = docSnap.docs.map(doc => doc.data() as ITeachers);

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
        const docRef = db.collection(companyName).doc("teachersAccounts").collection("accounts");

        const docSnap = await docRef.get();

        if (docSnap.empty) {
            response.setWarning("No se encontraron cuentas");
            return response;
        }

        // Obtener solo la propiedad 'teachersAccounts' del documento
        const teachersAccountsData = docSnap.docs.map((doc) => doc.data() as IAccount) ?? [];

        // Filtrar directamente mientras se asigna a response.Items
        response.Items = teachersAccountsData;
        response.TotalItems = response.Items.length;

        return response;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

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

        const accountRef = db
            .collection(companyName)
            .doc("teachersAccounts")
            .collection("accounts")
            .doc(idAccount);

        const docSnap = await accountRef.get();

        if (!docSnap.exists) {
            response.setWarning("Cuenta no encontrada");
            return response;
        }

        const currentAccount = docSnap.data() as IAccount;

        let updatedAccount;

        if (type === "increase") {
            updatedAccount = {
                amount: currentAccount.amount + monthly,
                balance: currentAccount.balance + monthly,
                increase: (currentAccount.increase || 0) + monthly,
            };
        } else {
            updatedAccount = {
                amount: currentAccount.amount - monthly,
                balance: currentAccount.balance - monthly,
                discounts: (currentAccount.discounts || 0) + monthly,
            };
        }

        await accountRef.update(updatedAccount);

        response.setSuccess("Cuenta modificada con éxito");
        return response;

    } catch (error: any) {
        console.error("Error actualizando la cuenta:", error);
        response.setError("Error interno del servidor");
        return response;
    }
};

export const getStudentAccountByAccountIdRepository = async (accountId: string): Promise<IAccount> => {
    let response = {} as IAccount;
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("studentsAccounts").collection("accounts")
            .where("id", "==", accountId);

        const docSnap = await docRef.get();

        if (docSnap.empty) {
            throw new Error("No se encontraron cuentas");
        }

        const studentsAccountsData: IAccount[] = docSnap.docs.map((doc) => doc.data() as IAccount) ?? [];

        const account = studentsAccountsData[0];

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

        const docRef = db.collection(companyName).doc("teachersAccounts").collection("accounts")
            .where("id", "==", accountId);
        const docSnap = await docRef.get();

        if (docSnap.empty) {
            throw new Error("No se encontraron cuentas");
        }

        const teachersAccountsData: IAccount[] = docSnap.docs.map((doc) => doc.data() as IAccount) ?? [];

        const account = teachersAccountsData[0];

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

        const docRef = db.collection(companyName).doc(type).collection("accounts");

        const docSnap = await docRef.get();

        if (!docSnap.empty) {
            throw new Error("No se encontraron cuentas");
        }

        const accountsData: IAccount[] = docSnap.docs.map((doc) => doc.data() as IAccount) ?? [];
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

        const docRef = db.collection(companyName).doc(editAccount.type).collection("accounts").doc(editAccount.accountId);

        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontraron cuentas");
        }

        let currentAccount = docSnap.data() as IAccount;
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
            amount: editAccount.amount,
            eftAmount: editAccount.eftAmount,
            balance: editAccount.amount - totalPaid,
            eftBalance: editAccount.eftAmount - totalPaid,
            status: isSettleAccount ? 'paid' : 'pending',
        };


        await docRef.update(updatedAccount);

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

        const docRef = db.collection(companyName).doc(type).collection("accounts").doc(account.id);

        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontraron cuentas");
        }

        let currentAccount = docSnap.data() as IAccount;

        await docRef.set(account as { [x: string]: any }, { merge: true });
        response.setSuccess('Cuenta modificada con exito');
    } catch (error: any) {
        response.setError(error.message);
        return response
    }
    return response;
}


export const settleAccountRepository = async (
    currentAccount: IAccount,
    type: string,
    paymentsMethods: PaymentMethod[]
): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const reference = type === 'student' ? 'studentsAccounts' : 'teachersAccounts';
        const docRef = db
            .collection(companyName)
            .doc(reference)
            .collection("accounts")
            .doc(currentAccount.id); // ✅ Referencia al documento exacto

        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            throw new Error("No se encontró la cuenta");
        }

        const currentPaid = paymentsMethods.reduce((acc, item) => acc + item.value, 0);
        const accountPaid = currentAccount.paymentsMethods.reduce((acc, item) => acc + item.value, 0);
        const totalPaid = currentPaid + accountPaid;

        const mergedPaymentsMethods = [...currentAccount.paymentsMethods];

        paymentsMethods.forEach((newPayment) => {
            const existingPaymentIndex = mergedPaymentsMethods.findIndex(
                (payment) => payment.idPayment === newPayment.idPayment
            );

            if (existingPaymentIndex !== -1) {
                mergedPaymentsMethods[existingPaymentIndex].value += newPayment.value;
            } else {
                mergedPaymentsMethods.push(newPayment);
            }
        });

        const amount = currentAccount.isPaidWhitEft
            ? currentAccount.eftAmount
            : currentAccount.amount;

        const status = amount - totalPaid === 0 || amount === 0 ? "paid" : "pending";

        const updatedAccount = {
            status,
            balance: amount - totalPaid,
            eftBalance: currentAccount.eftAmount - totalPaid,
            paymentsMethods: mergedPaymentsMethods,
            settleDate: format(new Date(), 'full'), // ✅ formato válido
            amount: status === "paid" ? amount : currentAccount.amount,
            eftAmount: status === "paid" ? amount : currentAccount.eftAmount,
        };

        // ✅ Actualizar campos usando merge
        await docRef.set(updatedAccount, { merge: true });

        response.setSuccess("Cuenta modificada con éxito");

    } catch (error: any) {
        console.log(error);
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

        // Guardar la cuenta como documento individual
        const docRef = db
            .collection(companyName)
            .doc(type)
            .collection("accounts")
            .doc(accountId);

        await docRef.set(newAccount);

        response.setSuccess("Cuenta creada con éxito");
    } catch (error: any) {
        console.error(error);
        response.setError(error.message);
    }

    return response;
};


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

        // Guardar la cuenta como documento individual
        const docRef = db
            .collection(companyName)
            .doc(referenceSearch)
            .collection("accounts")
            .doc(newAccount.id);

        await docRef.set(newAccount);
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