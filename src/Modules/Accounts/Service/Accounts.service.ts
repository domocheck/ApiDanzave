import { format } from "@formkit/tempo";
import { getLimit, getMontlyByTeacherId, getPaymentsMethodsFromConfigRepository, getStudentsPricesRepository, getTeachersPricesRepository } from "../../Config/Repository/Config.repository";
import { IMovement } from "../../Drawers/Models/Drawer.models";
import { getChasDrawerOpenRepository, getMovementByAccountIdRepository, getMovementByPersonIdRepository } from "../../Drawers/Repository/Drawer.repository";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { IStudents } from "../../Students/Models/Students.models";
import { getFullNameStudentById, getStudentByIdRepository, getStudentsActives, getStudentsByStatus } from "../../Students/Repository/StudentsRepository";
import { ITeachers } from "../../Teachers/Models/Teachers.models";
import { getFullNameTeacherById, getTeacherById, getTeachersActives } from "../../Teachers/Repository/Teachers.repository";
import { Account, AccountWhitDebt, EditAccount, GenerateAccount, IAccount, SettleAccount, SettleAccountInd, SettleAccountResponse, SettleFormInfo, StatusAccountInd, StatusAccountStudent, StatusAccountTeacher } from "../Models/Accounts.models";
import { editAccountRepository, generateAccountPersonRepository, generateAccountRepository, getAccountsByStudentIdRepository, getAccountsByTeacherIdRepository, getAccountsStudentsActivesRepository, getAccountsTeachersActives, getStudentAccountByAccountIdRepository, getStudentsAccounts, getStudentsAccountsByStatus, getTeacherAccountByAccountIdRepository, getTeachersAccounts, getTeachersByStatus, settleAccountRepository, updateAccountTeacherRepository } from "../Repository/Accounts.repository";
import { v4 as uuidv4 } from 'uuid';
import { saveMovementService } from "../../Drawers/Service/Drawer.service";
import { IPagedListUnpaidAccount, PagedListAccounts, PagedListUnpaidAccounts, SearchPagedListAccounts, SearchPagedListUnpaidAccounts } from "../Models/Accounts-paged-list.models";
import { checkLastDatehWhitoutSettle } from "../Helpers/Accounts.helpers";

export const getPersonWhitDebt = async (type: string): Promise<AccountWhitDebt[] | null> => {
    const typeAccounts = type === 'receipt' ? await getAccountsStudentsActivesRepository() : await getAccountsTeachersActives();
    const typeArray = type === 'receipt' ? await getStudentsActives() : await getTeachersActives();

    const processedIds = new Set();

    const accounts = typeAccounts.map((account) => {
        if (processedIds.has(account.idPerson)) {
            return null; // Saltar si ya se ha procesado este idPerson
        } else {
            processedIds.add(account.idPerson); // Agregar el idPerson al conjunto procesado
        }

        const person = typeArray.find((person) => person.id === account.idPerson);
        const newAccount = new AccountWhitDebt();
        let hasPending = false; // Variable para verificar si hay cuentas pendientes

        if (person) {
            const personAccounts = typeAccounts.filter((a) => a.idPerson === person.id);
            personAccounts.forEach((account) => {
                if (account.status === 'pending') {
                    hasPending = true;
                    newAccount.name = person.name;
                    newAccount.lastName = person.lastName;
                    newAccount.idPerson = person.id;
                    newAccount.accounts.push(account);
                    newAccount.displayName = `${person.name} ${person.lastName}`;
                }
            });

            // Solo limpiamos si no hay cuentas pendientes
            if (!hasPending) {
                newAccount.name = '';
                newAccount.lastName = '';
                newAccount.idPerson = '';
                newAccount.accounts = [];
                newAccount.displayName = '';
            }
        }
        return newAccount;
    });

    // Filtrar elementos nulos del arreglo y los que no tienen idPerson
    const filteredAccounts = accounts.filter((account) => account && account.idPerson);

    if (filteredAccounts.length > 0) {
        return filteredAccounts as AccountWhitDebt[];
    } else {
        return null;
    }
}

export const updateAccountTeacherService = async (idAccount: string, idTeacher: string, type: string): Promise<ResponseMessages> => {
    const teacherMontly = await getMontlyByTeacherId(idTeacher)
    return await updateAccountTeacherRepository(idAccount, teacherMontly, type);
}

export const getAccountsStudentsActivesService = async (): Promise<Account> => {
    let response = new Account();
    try {
        const paymentsConfig = await getPaymentsMethodsFromConfigRepository();
        const paymentEft = paymentsConfig.find(p => p.name.includes('efectivo'));

        const studentsActives = await getStudentsByStatus('activo');
        if (studentsActives && studentsActives.length > 0) {
            const activeIds = studentsActives.map((s) => s.id); // Extraer los IDs de los estudiantes activos
            response.Items = (await getStudentsAccounts()).Items.filter((account) => activeIds.includes(account.idPerson)).map((a) => {
                return {
                    ...a,
                    isPaidWhitEft: a.paymentsMethods.length > 0 ? a.paymentsMethods.every(p => p.value > 0 && p.idPayment === paymentEft?.id) : true
                }
            }); // Filtrar cuentas por ID
            response.TotalItems = response.Items.length;
        }

    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
    return response;
}

export const getStatusAccountsStudentService = async (studentId: string): Promise<StatusAccountStudent> => {
    let response = new StatusAccountStudent();

    const [students, accounts, movements, paymenthMethodsConfig] = await Promise.all([
        getStudentByIdRepository(studentId),
        getAccountsByStudentIdRepository(studentId),
        getMovementByPersonIdRepository(studentId),
        getPaymentsMethodsFromConfigRepository()
    ]);
    const paymentEft = paymenthMethodsConfig.find(p => p.name.includes('efectivo'));
    response.Student = students

    if (movements && movements.length > 0) {
        movements.filter(m => m.description.toLowerCase().includes('clase de prueba')).forEach((m) =>
            accounts.push({
                id: m.id,
                idPerson: m.idPerson!,
                month: 11,
                year: 2024,
                amount: m.amount,
                paymentsMethods: m.paymentsMethods,
                status: !m.balance || m.balance === 0 ? 'paid' : 'pending',
                settleDate: m.date,
                description: m.description,
                balance: m.balance || 0,
                eftBalance: m.balance || 0,
                eftAmount: m.amount || 0,
            }),
        );
    }

    response.Accounts = accounts.map(a => {
        return {
            ...a,
            isPaidWhitEft: a.paymentsMethods.length > 0 ? a.paymentsMethods.every(p => p.value > 0 && p.idPayment === paymentEft?.id) : true

        }
    })

    return response;
}

export const getStatusAccountsTeacherService = async (teacherId: string): Promise<StatusAccountTeacher> => {
    let response = new StatusAccountTeacher();

    const [teachers, accounts, movements, paymenthMethodsConfig] = await Promise.all([
        getTeacherById(teacherId),
        getAccountsByTeacherIdRepository(teacherId),
        getMovementByPersonIdRepository(teacherId),
        getPaymentsMethodsFromConfigRepository()
    ]);
    const paymentEft = paymenthMethodsConfig.find(p => p.name.includes('efectivo'));
    response.Teacher = teachers

    if (movements && movements.length > 0) {
        movements.filter(m => m.description.toLowerCase().includes('clase de prueba')).forEach((m) =>
            accounts.push({
                id: m.id,
                idPerson: m.idPerson!,
                month: 11,
                year: 2024,
                amount: m.amount,
                paymentsMethods: m.paymentsMethods,
                status: !m.balance || m.balance === 0 ? 'paid' : 'pending',
                settleDate: m.date,
                description: m.description,
                balance: m.balance || 0,
                eftBalance: m.balance || 0,
                eftAmount: m.amount || 0,
            }),
        );
    }

    response.Accounts = accounts.map(a => {
        return {
            ...a,
            isPaidWhitEft: a.paymentsMethods.length > 0 ? a.paymentsMethods.every(p => p.value > 0 && p.idPayment === paymentEft?.id) : true

        }
    })

    return response;
}

export const getIndAccountService = async (type: string, accountId: string): Promise<StatusAccountInd<IStudents | ITeachers>> => {
    let response: StatusAccountInd<IStudents | ITeachers>;

    if (type === 'student') {
        response = new StatusAccountInd<IStudents>();
        const [account, movements, paymentMethods] = await Promise.all([
            getStudentAccountByAccountIdRepository(accountId),
            getMovementByAccountIdRepository(accountId),
            getPaymentsMethodsFromConfigRepository(),
        ])
        const paymentEft = paymentMethods.find(p => p.name.includes('efectivo'));
        const person = await getStudentByIdRepository(account.idPerson);
        response.Momvements = movements;
        response.PaymentMethodsConfig = paymentMethods;
        response.Person = person;
        response.TypePerson = 'studentsAccounts'
        response.Account = {
            ...account,
            isPaidWhitEft: account.paymentsMethods.length > 0 ? account.paymentsMethods.every(p => p.value > 0 && p.idPayment === paymentEft?.id) : false
        };
    } else {
        response = new StatusAccountInd<ITeachers>();
        const [account, movements, paymentMethods] = await Promise.all([
            getTeacherAccountByAccountIdRepository(accountId),
            getMovementByAccountIdRepository(accountId),
            getPaymentsMethodsFromConfigRepository(),
        ])
        const paymentEft = paymentMethods.find(p => p.name.includes('efectivo'));

        const person = await getTeacherById(account.idPerson);
        response.Momvements = movements;
        response.PaymentMethodsConfig = paymentMethods;
        response.Person = person;
        response.TypePerson = 'teachersAccounts'
        response.Account = {
            ...account,
            isPaidWhitEft: account.paymentsMethods.length > 0 ? account.paymentsMethods.every(p => p.value > 0 && p.idPayment === paymentEft?.id) : true
        };
    }


    return response;
}

export const editAccountService = async (editAccount: EditAccount): Promise<ResponseMessages> => {
    return await editAccountRepository(editAccount);
}

export const getSettleIFormInfoService = async (): Promise<SettleFormInfo> => {
    let response = new SettleFormInfo();
    try {
        const [paymentsMethods, cashDrawerOpen] = await Promise.all([
            getPaymentsMethodsFromConfigRepository(),
            getChasDrawerOpenRepository()
        ])
        response.drawerOpen = cashDrawerOpen;
        response.paymentsMethods = paymentsMethods;
        return response;
    } catch (error: any) {
        response.setError(error.message);
        return response;
    }

    return response;
}

export const settleAccountService = async (settleAccounts: SettleAccount[]): Promise<SettleAccountResponse> => {
    let response = new SettleAccountResponse();
    try {
        let items: SettleAccountInd[] = [];
        for (let settleAccount of settleAccounts) {
            const settle = await settleAccountRepository(settleAccount.account, settleAccount.type, settleAccount.paymentsMethods)
            if (settle.hasErrors()) {
                response.setError('Error interno del servidor, intente nuevamente');
                return response;
            }

            const newMovement: IMovement = {
                id: uuidv4(),
                amount: settleAccount.account.isPaidWhitEft ? settleAccount.account.eftAmount : settleAccount.account.amount,
                paymentsMethods: settleAccount.paymentsMethods,
                description: `${(settleAccount.type === 'student' || settleAccount.type === 'receipt') ? 'Cobro' : 'Pago'} ${settleAccount.account.description}`,
                date: format(new Date(), 'full'),
                idPerson: settleAccount.account.idPerson,
                type: (settleAccount.type === 'student' || settleAccount.type === 'receipt') ? 'receipt' : 'payment',
                balance: settleAccount.account.isPaidWhitEft ? settleAccount.account.eftBalance - settleAccount.total : settleAccount.account.balance - settleAccount.total || 0,
                idAccount: settleAccount.account.id,
            };


            const save = await saveMovementService(newMovement)
            if (save.hasErrors()) {
                response.setError('Error interno del servidor, intente nuevamente');
                return response;
            }
            const newItem = {
                balance: newMovement.balance!,
                date: newMovement.date as string,
                description: newMovement.description,
                namePerson: settleAccount.type === 'student' || settleAccount.type === 'receipt'
                    ? await getFullNameStudentById(settleAccount.account.idPerson)
                    : await getFullNameTeacherById(settleAccount.account.idPerson),
                payments: newMovement.paymentsMethods,
                totalPaid: settleAccount.total
            }
            items.push(newItem);
        }
        response.setSuccess('Operacion exitosa');
        response.Items = items;
    } catch (error: any) {
        response.setError(error.message);
        return response;
    }

    return response;
}

export const getPagedListAccountsService = async (search: SearchPagedListAccounts): Promise<PagedListAccounts> => {
    let response = new PagedListAccounts();
    try {
        const limit = await getLimit()
        const typeAccounts = search.Type === 'students' ? await getStudentsAccounts() : await getTeachersAccounts();
        const typeArray = search.Type === 'students' ? await getStudentsByStatus('activo') : await getTeachersByStatus('activo');

        const processedIds = new Set();

        let accounts = typeAccounts.Items.map((account: IAccount) => {
            let balanceAccount = {
                id: '',
                name: '',
                lastName: '',
                status: '',
                balance: 0,
                month: '',
                year: '',
            };
            if (processedIds.has(account.idPerson)) {
                return null; // Saltar si ya se ha procesado este idPerson
            } else {
                processedIds.add(account.idPerson); // Agregar el idPerson al conjunto procesado
            }

            const person = typeArray.find((person) => person.id === account.idPerson);
            if (person && person.status === 'activo') {
                const personAccounts = typeAccounts.Items.filter((a) => a.idPerson === person.id);
                const isAllPaid = personAccounts.every((account) => account.status === 'paid');
                personAccounts.forEach((account) => {
                    balanceAccount.month = isAllPaid
                        ? '-'
                        : checkLastDatehWhitoutSettle(balanceAccount.month, account.month, account.status);
                    balanceAccount.year = isAllPaid
                        ? '-'
                        : checkLastDatehWhitoutSettle(balanceAccount.year, account.year, account.status);

                    balanceAccount = {
                        id: person.id,
                        name: person.name,
                        lastName: person.lastName,
                        status: balanceAccount.balance + account.balance > 0 ? 'pending' : 'paid',
                        balance: (balanceAccount.balance += account.balance),
                        month: balanceAccount.month,
                        year: balanceAccount.year,
                    };
                });
            } else return null;

            return balanceAccount;
        }).filter((account) => account !== null).reverse().map(a => {
            return {
                id: a.id,
                fullName: `${a.name} ${a.lastName}`,
                status: a.status,
                amount: a.balance,
                month: a.month,
                year: a.year,
            }
        });

        if (search.Name) {
            accounts = accounts.filter((account) => account.fullName.toLowerCase().includes(search.Name.toLowerCase()));
        }
        if (search.Status && search.Status !== 'all') {
            accounts = accounts.filter((account) => account.status === search.Status);
        }

        response.TotalItems = accounts.length;
        response.PageSize = limit;
        response.TotalDebt = accounts.filter(a => a.status === 'pending').reduce((acc, a) => acc + a.amount, 0);
        response.TotalPaidAccounts = accounts.filter(a => a.status === 'paid').length;

        if (search.Page > 0) {
            const startIndex = (search.Page - 1) * limit;
            const endIndex = startIndex + limit;
            accounts = accounts.slice(startIndex, endIndex);
        }

        response.Items = accounts;
    } catch (error: any) {
        response.setError(error.message);
        return response;
    }

    return response;
}

export const generateStudentsAccountsService = async (): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();
        const prices = await getStudentsPricesRepository()
        const students = await getStudentsByStatus('activo');

        for (let student of students) {
            const studentAccounts = await getAccountsByStudentIdRepository(student.id)
            const hasAccount = studentAccounts.filter(a => a.month === month && a.year === year).length > 0;
            const hasTuitionAccount = studentAccounts.filter(a => a.year === year && a.description?.toLowerCase().includes('matricula')).length > 0;

            if (!hasAccount && student.monthly && student.classes && student.classes.length > 0) {
                const { regularPrice, eftPrice } = prices.filter((p) => p.id === student.monthly)[0];
                await generateAccountPersonRepository(student, 'students', regularPrice, eftPrice)
            }
            if (!hasTuitionAccount && student.tuition) {
                const { regularPrice, eftPrice, name } = prices.filter((p) => p.id === student.tuition!)[0];
                await generateAccountPersonRepository(student, 'students', regularPrice, eftPrice, name)
            }
        }

        response.setSuccess('Cuentas generadas con exito');
    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
    return response;
}

export const generateTeachersAccountsService = async (): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();
        const prices = await getTeachersPricesRepository()
        const teachers = await getTeachersByStatus('activo');

        for (let teacher of teachers) {
            const teacherAccounts = await getAccountsByTeacherIdRepository(teacher.id)
            const hasAccount = teacherAccounts.filter(a => a.month === month && a.year === year).length > 0;

            if (!hasAccount && teacher.monthly && teacher.classes && teacher.classes.length > 0) {
                const { regularPrice, eftPrice } = prices.filter((p) => p.id === teacher.monthly)[0];
                await generateAccountPersonRepository(teacher, 'teachers', regularPrice, eftPrice)
            }
        }

        response.setSuccess('Cuentas generadas con exito');
    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
    return response;
}

export const generateAccountService = async (generateAccount: GenerateAccount): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        await generateAccountRepository(generateAccount);
        response.setSuccess('Cuenta generada con exito');
    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
    return response;
}

export const getPagedListUnpaidAccountsService = async (search: SearchPagedListUnpaidAccounts): Promise<PagedListUnpaidAccounts> => {
    let response = new PagedListUnpaidAccounts();
    try {
        const limit = await getLimit();
        let unpaidAccounts: IAccount[] = []
        const studentsActivesIds = (await getStudentsByStatus('activo')).map(s => ({ id: s.id, fullName: `${s.name} ${s.lastName}` }));
        const studentsAccounts = (await getStudentsAccountsByStatus('pending')).Items.filter((a: IAccount) =>
            a.month === search.Month &&
            a.year === search.Year &&
            studentsActivesIds.map(sa => sa.id).includes(a.idPerson)
        )

        unpaidAccounts = studentsAccounts.map(sa => {
            return {
                ...sa,
                displayName: studentsActivesIds.find(s => s.id === sa.idPerson)!.fullName
            }
        }).sort((a, b) => a.displayName!.localeCompare(b.displayName!))

        const uniqueOptions = new Set<string>();
        // Recorre las cuentas y agrega descripciones únicas al Set
        unpaidAccounts.forEach((account) => {
            if (account.description) {
                uniqueOptions.add(account.description);
            }
        });

        // Convertir el Set a un array de objetos HeadersTable
        response.FilteringOptions = Array.from(uniqueOptions).map((description) => ({
            id: description,
            name: description,
        }));
        response.FilteringOptions = [{
            id: 'all',
            name: 'Todos'
        }, ...response.FilteringOptions];

        if (search.Name) {
            unpaidAccounts = unpaidAccounts.filter(a => a.displayName!.toLowerCase().includes(search.Name.toLowerCase()))
        }
        if (search.Status && search.Status !== 'all') {
            unpaidAccounts = unpaidAccounts.filter(a => a.description === search.Status);
        }

        response.PageSize = limit;
        response.TotalItems = unpaidAccounts.length;
        response.TotalDebt = unpaidAccounts.reduce((total, account) => total + account.balance, 0);

        if (search.Page > 0) {
            const startIndex = (search.Page - 1) * limit;
            const endIndex = startIndex + limit;
            unpaidAccounts = unpaidAccounts.slice(startIndex, endIndex);
        }
        response.Items = unpaidAccounts;

    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
    return response;
}