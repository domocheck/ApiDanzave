import { format } from "@formkit/tempo";
import { db } from "../../../Firebase/firebase";
import { IAccount } from "../../Accounts/Models/Accounts.models";
import { getStudentsAccounts } from "../../Accounts/Repository/Accounts.repository";
import { IAssists, StudentsAssists } from "../../Assists/Models/Assists.models";
import { getAssistsByClassId, getAssistsByPersonId, getAssistsRepository } from "../../Assists/Repository/Assists.repository";
import { getAssistByClassIdService } from "../../Assists/Service/Assists.service";
import { Sale } from "../../Boutique/Models/Sale.models";
import { getProductsRepository, getSalesRepository } from "../../Boutique/Repository/Boutique.respository";
import { ClassAssist } from "../../Classes/Models/classes.models";
import { getClassByIdRepository, getClasses, getClassesByStatusRepository, getClassesRepository } from "../../Classes/Repository/Classes.repository";
import { getExpirationDaysFromConfigRepository, getHoursFromConfigRepository, getLimit, getPaymentsMethodsFromConfigRepository, getRangesFromConfigRepository, getReasonsFromConfigRepository } from "../../Config/Repository/Config.repository";
import { IContacts } from "../../Contacts/Models/Contact.models";
import { getContactByIdRepository, getContactsByStatusRepository } from "../../Contacts/Repository/Contacts.repository";
import { IDrawer, IMovement } from "../../Drawers/Models/Drawer.models";
import { getStudentById } from "../../Students/Controller/Students.controller";
import { IStudents } from "../../Students/Models/Students.models";
import { getStudentByIdRepository, getStudentsByStatus, getStudentsRepository } from "../../Students/Repository/StudentsRepository";
import { getTeachersRepository } from "../../Teachers/Repository/Teachers.repository";
import { formatDateToDate, normalizeDate } from "../Helpers/FormatDateToDate";
import { getCompanyName } from "../Helpers/getCompanyName";
import { months } from "../Helpers/Others";
import { checkReason, generateArrayPersons, getHisoryClassByAssistDate } from "../Helpers/StatsHelpers";
import { PagedListAccountExpirations, SearchPagedListAccountExpirations } from "../Models/Stats/Accounts-expiration-paged-list.model";
import { AssistsByDateResponse } from "../Models/Stats/Assists-by-date-paged-list.model";
import { AssistsControlResponse } from "../Models/Stats/Assists-control.model";
import { IPagedListAvgAssist, PagedListAvgAssists, SearchPagedListAvgAssists } from "../Models/Stats/Avg-Assists-paged-list.model";
import { IPagedListContactsProofClass, PagedListContactsProofClass, SearchPagedListContactsProofClass } from "../Models/Stats/Contacts-proof-class-paged-list.model";
import { IPagedListEnrolledStudent, PagedListEnrolledStudents, SearchPagedListEnrolledStudents } from "../Models/Stats/Enrolled-students-paged-list.moodel";
import { HistoryClassesResponse } from "../Models/Stats/History-classes.model";
import { IPagedListPaymentMethod, PagedListPaymentMethods, SearchPagedListPaymentMethods } from "../Models/Stats/Payment-method-paged-list.model";
import { IPagedListPBS, PagedListPBS, SearchPagedListPBS } from "../Models/Stats/PBS-paged-list.model";
import { IPagedListSalesStat, PagedListSalesStats, SearchPagedListSalesStats } from "../Models/Stats/Sales-stats-paged-list.model";
import { IPagedListStudentsActives, PagedListStudentsActives, SearchPagedListStudentsActives } from "../Models/Stats/Students-actives-paged-list.model";
import { IPagedListStudentsInactives, PagedListStudentsInactives, SearchPagedListStudentsInactives } from "../Models/Stats/Students-inactives-paged-list.model";

export const getPagedListPBSRepository = async (search: SearchPagedListPBS): Promise<PagedListPBS> => {
    const response = new PagedListPBS();
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

        let movements: IMovement[] = docSnap.data()?.drawers.flatMap((drawer: IDrawer) => drawer.movements ?? []).filter((m: IMovement) => m.type === 'receipt');

        if (!Array.isArray(movements)) {
            response.setError("No se encontraron gastos válidos");
            return response;
        }
        if (search.Student && search.Student !== 'undefined') {
            movements = movements.filter(m => m.idPerson === search.Student);
        }

        if (search.PaymentMethod && search.PaymentMethod !== 'undefined') {
            movements = movements.filter(m => m.paymentsMethods.some(pm => pm.idPayment === search.PaymentMethod && pm.value > 0));
        }
        if (search.StartDate && search.EndDate) {
            movements = movements.filter(d => {
                const movementDate = normalizeDate(formatDateToDate(d.date as string));
                return movementDate >= search.StartDate! && movementDate <= search.EndDate!;
            })
        }
        const paymentsConfig = await getPaymentsMethodsFromConfigRepository();
        const students = await getStudentsRepository()
        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedPBS: IPagedListPBS[] = movements.map(d => {
            const student = students.find(s => s.id === d.idPerson);
            return {
                id: d.id,
                date: d.date as string,
                description: d.description,
                amount: d.paymentsMethods.reduce((acc, p) => acc + p.value, 0),
                payments: d.paymentsMethods.map(p => {
                    return {
                        id: p.idPayment,
                        name: paymentsConfig.find(pc => pc.id === p.idPayment)?.name ?? "",
                        value: p.value
                    }
                }),
                fullName: student ? `${student.name} ${student.lastName}` : "-"
            }
        }).slice(startIndex, endIndex);

        response.Items = paginatedPBS;
        response.TotalItems = movements.length;
        response.PageSize = limit;
        response.TotalPaid = paginatedPBS.reduce((acc, p) => acc + p.payments.reduce((acc, p) => acc + p.value!, 0), 0);
        response.Students = students.map(s => ({ id: s.id, name: `${s.name} ${s.lastName}` }));
        response.PaymentMethods = paymentsConfig.map(pm => ({ id: pm.id, name: pm.name }));
        return response;
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}
export const getPagedListPaymentMethodRepository = async (search: SearchPagedListPaymentMethods): Promise<PagedListPaymentMethods> => {
    const response = new PagedListPaymentMethods();
    try {
        const companyName = getCompanyName();
        const paymentsConfig = await getPaymentsMethodsFromConfigRepository();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        const docRef = db.collection(companyName).doc("drawers");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            response.setError("No se encontraron esudiantes");
            return response;
        }

        let movements: IMovement[] = docSnap.data()?.drawers.flatMap((drawer: IDrawer) => drawer.movements ?? []).filter((m: IMovement) => m.type !== 'egress' && m.type !== 'payment');

        if (!Array.isArray(movements)) {
            response.setError("No se encontraron gastos válidos");
            return response;
        }
        if (search.StartDate && search.EndDate) {
            movements = movements.filter(d => {
                const movementDate = normalizeDate(formatDateToDate(d.date as string));
                return movementDate >= search.StartDate! && movementDate <= search.EndDate!;
            })
        }

        let moveByPayment: any = {};
        let payments: any = {};

        movements.forEach((move) => {
            move.paymentsMethods.forEach((payment) => {
                const paymentName = paymentsConfig.find((pay) => pay.id === payment.idPayment)?.name;
                const paymentValue = payment.value;
                if (paymentName) {
                    if (moveByPayment[paymentName]) {
                        moveByPayment[paymentName] += paymentValue;
                    } else {
                        moveByPayment[paymentName] = paymentValue;
                    }
                }
            });
        });

        // Convertimos moveByPayment a un array de objetos
        payments = Object.entries(moveByPayment).map(([name, value]) => ({
            paymentName: name,
            paymentValue: value as number,
        }));

        if (search.Payment && search.Payment !== 'undefined') {
            const paymentName = paymentsConfig.find((pay) => pay.id === search.Payment)?.name;
            payments = payments.filter((d: any) => d.paymentName === paymentName);
        }


        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedPayments: IPagedListPaymentMethod[] = payments.map((d: any) => {
            return {
                id: d.id,
                name: d.paymentName,
                value: d.paymentValue,
            }
        }).slice(startIndex, endIndex);

        response.Items = paginatedPayments;
        response.TotalItems = movements.length;
        response.PageSize = limit;
        response.TotalPaid = paginatedPayments.reduce((acc, p) => acc + p.value, 0);
        response.PaymentMethods = paymentsConfig.map(pm => ({ id: pm.id, name: pm.name }));
        return response;
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}

export const getPagedListStudentsInactivesRepository = async (search: SearchPagedListStudentsInactives): Promise<PagedListStudentsInactives> => {
    const response = new PagedListStudentsInactives();
    try {
        let studentsInactives: IStudents[] = await getStudentsByStatus('inactivo');
        if (search.Reason && search.Reason !== 'undefined') {
            studentsInactives = studentsInactives.filter(s => s.idReason === search.Reason);
        }

        if (search.StartDate && search.EndDate) {
            studentsInactives = studentsInactives.filter(d => {
                if (d.inactiveDate) {
                    const inactivatedDate = normalizeDate(formatDateToDate(d.inactiveDate as string));
                    return inactivatedDate >= search.StartDate! && inactivatedDate <= search.EndDate!;

                }
            })
        }
        if (search.Name) {
            studentsInactives = studentsInactives.filter((item: IStudents) =>
                item.name.toLowerCase().includes(search.Name.toLowerCase()) ||
                item.lastName.toLowerCase().includes(search.Name.toLowerCase())
            );
        }

        const reasonsConfig = await getReasonsFromConfigRepository();
        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedStudentsInactives: IPagedListStudentsInactives[] = studentsInactives.map(d => {
            return {
                id: d.id,
                fullName: d ? `${d.name} ${d.lastName}` : "-",
                inactivatedDate: d.inactiveDate as string,
                reason: reasonsConfig.find(rc => rc.id === d.idReason)?.name ?? ""
            }
        }).slice(startIndex, endIndex);

        response.Items = paginatedStudentsInactives;
        response.TotalItems = studentsInactives.length;
        response.PageSize = limit;
        response.Reasons = reasonsConfig.map(pm => ({ id: pm.id, name: pm.name }));
        return response;
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}

export const getPagedListStudentsActivesRepository = async (search: SearchPagedListStudentsActives): Promise<PagedListStudentsActives> => {
    const response = new PagedListStudentsActives();
    try {
        let students: IStudents[] = await getStudentsRepository();
        if (search.Status && search.Status !== 'all') {
            students = students.filter(s => s.status === search.Status);
        }

        if (search.StartDate && search.EndDate) {
            students = students.filter(d => {
                if (d.createDate) {
                    const activatedDate = normalizeDate(formatDateToDate(d.createDate as string));
                    return activatedDate >= search.StartDate! && activatedDate <= search.EndDate!;

                }
            })
        }
        if (search.Name) {
            students = students.filter((item: IStudents) =>
                item.name.toLowerCase().includes(search.Name.toLowerCase()) ||
                item.lastName.toLowerCase().includes(search.Name.toLowerCase())
            );
        }

        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedStudents: IPagedListStudentsActives[] = students.map(d => {
            return {
                id: d.id,
                fullName: d ? `${d.name} ${d.lastName}` : "-",
                activatedDate: d.createDate as string,
                status: d.status as string
            }
        }).slice(startIndex, endIndex);

        response.Items = paginatedStudents;
        response.TotalItems = students.length;
        response.PageSize = limit;
        return response;
    } catch (error) {
        console.error("Error obteniendo estudiantes:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}

export const getPagedListContactsProofClassRepository = async (search: SearchPagedListContactsProofClass): Promise<PagedListContactsProofClass> => {
    const response = new PagedListContactsProofClass();
    try {
        let activeContacts = await getContactsByStatusRepository('activo');
        let assists = await getAssistsRepository();
        let classes = await getClasses()
        let contacts: IPagedListContactsProofClass[] = [];

        for (let contact of activeContacts) {
            assists
                .filter(
                    (a) =>
                        a.absent.includes(contact.id) ||
                        a.disease.includes(contact.id) ||
                        a.missing.includes(contact.id) ||
                        a.presents.includes(contact.id) ||
                        a.proofClass.includes(contact.id),
                )
                .forEach((assist) => {
                    const existingClass = contacts.some((c) => c.classId === assist.idClass);
                    if (!existingClass) {
                        contacts.push({
                            id: contact.id,
                            fullName: `${contact.name} ${contact.lastName}`,
                            date: assist.date as string,
                            className: classes.find((c) => c.id === assist.idClass)?.dance ?? "Sin clase",
                            classId: assist.idClass,
                        });
                    }
                });
        }

        if (search.Year) {
            contacts = contacts.filter((c: IPagedListContactsProofClass) => c.date.toString().includes(search.Year));
            if (search.Month && search.Month > 0) {
                contacts = contacts.filter(c => {
                    const date = c.date as string;
                    const monthDateAssists = date.substring(date.indexOf(' de ') + 4, date.lastIndexOf(' de')).trim();
                    const monthAssists = months.filter(m => m.name.toLowerCase() === monthDateAssists.toLowerCase())[0]?.value
                    return monthAssists === search.Month
                })
            }
        }

        if (search.Name) {
            contacts = contacts.filter((item: IPagedListContactsProofClass) =>
                item.fullName.toLowerCase().includes(search.Name.toLowerCase()) ||
                item.className.toLowerCase().includes(search.Name.toLowerCase())
            );
        }

        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedContacts = contacts.slice(startIndex, endIndex);

        response.Items = paginatedContacts;
        response.TotalItems = contacts.length;
        response.PageSize = limit;
        return response;
    } catch (error) {
        console.error("Error obteniendo estudiantes:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}

export const getPagedListEnrolledStudentsRepository = async (search: SearchPagedListEnrolledStudents): Promise<PagedListEnrolledStudents> => {
    const response = new PagedListEnrolledStudents();
    try {
        let studentsAccounts = (await getStudentsAccounts()).Items;
        const studentsIds = new Set(studentsAccounts.map(sp => sp.idPerson))
        let enrolledStudents: IPagedListEnrolledStudent[] = [];

        if (studentsIds.size > 0) {
            for (let id of studentsIds) {
                const student = await getStudentByIdRepository(id);
                if (student) {
                    let matchingTuitionPayment: IAccount | undefined = {} as IAccount;

                    matchingTuitionPayment = studentsAccounts.find(sp =>
                        sp.idPerson === student?.id &&
                        sp.year === +search.Year &&
                        sp.description?.toLowerCase().includes('matricula')
                    );

                    if (search.Month) {
                        let monthAccountPaid;
                        if (matchingTuitionPayment?.status === 'paid' && matchingTuitionPayment?.settleDate) {
                            const date = matchingTuitionPayment?.settleDate as string;
                            const monthSettleDateAccount = date.substring(date.indexOf(' de ') + 4, date.lastIndexOf(' de')).trim();
                            monthAccountPaid = months.filter(m => m.name.toLowerCase() === monthSettleDateAccount.toLowerCase())[0].value
                        }
                        if ((matchingTuitionPayment?.status === 'paid' && monthAccountPaid === search.Month) || (matchingTuitionPayment?.status === 'pending' && matchingTuitionPayment?.month === search.Month)) {
                            enrolledStudents.push({
                                id: student?.id,
                                fullName: `${student?.name} ${student?.lastName}`,
                                tuitionPaymentStatus: matchingTuitionPayment != undefined ? matchingTuitionPayment.status === 'paid' ? 'paid' : 'pending' : 'noAccount',
                                tuitionPaymentAmount: matchingTuitionPayment ? matchingTuitionPayment.amount : 0,
                                tuitionPaymentDate: matchingTuitionPayment ? matchingTuitionPayment.settleDate as string : '',
                                activatedDate: student.createDate as string,
                                status: student.status!
                            })
                        }
                    } else {
                        enrolledStudents.push({
                            id: student?.id,
                            fullName: `${student?.name} ${student?.lastName}`,
                            tuitionPaymentStatus: matchingTuitionPayment != undefined ? matchingTuitionPayment.status === 'paid' ? 'paid' : 'pending' : 'noAccount',
                            tuitionPaymentAmount: matchingTuitionPayment ? matchingTuitionPayment.amount : 0,
                            tuitionPaymentDate: matchingTuitionPayment ? matchingTuitionPayment.settleDate as string : '',
                            activatedDate: student.createDate as string,
                            status: student.status!
                        })
                    }

                }
            }

        }

        if (search.Name) {
            enrolledStudents = enrolledStudents.filter((item: IPagedListEnrolledStudent) =>
                item.fullName.toLowerCase().includes(search.Name.toLowerCase())
            );
        }

        if (search.Status && search.Status !== 'all') {
            enrolledStudents = enrolledStudents.filter((item: IPagedListEnrolledStudent) =>
                item.status === search.Status
            );
        }

        if (search.Payment && search.Payment !== 'all') {
            enrolledStudents = enrolledStudents.filter((item: IPagedListEnrolledStudent) =>
                item.tuitionPaymentStatus === search.Payment
            );
        }

        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedContacts = enrolledStudents.slice(startIndex, endIndex);

        response.Items = paginatedContacts;
        response.TotalItems = enrolledStudents.length;
        response.PageSize = limit;
        return response;
    } catch (error) {
        console.error("Error obteniendo estudiantes:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}

export const getAssistsByDateRepository = async (date: string, classeId: string): Promise<AssistsByDateResponse> => {
    const response = new AssistsByDateResponse();
    try {
        let assist: IAssists = (await getAssistsByClassId(classeId)).Items.filter(a => a.date === date)[0];
        if (!assist.id) {
            return response;
        }

        response.IndAssist = assist
        response.IndClass = await getClassByIdRepository(assist.idClass);
        return response;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}

export const getAssistsControlRepository = async (day: string, year: string, teacherId: string): Promise<AssistsControlResponse> => {
    const response = new AssistsControlResponse();
    try {
        const assistsDb = await getAssistsRepository();
        const classesDb = await getClasses()
        const classesInactives = assistsDb
            .filter((a) => {
                const aDate = a.date.toString();
                const assistDay = aDate.substring(0, aDate.indexOf(',')).trim().toLowerCase();
                const assistYear = aDate.substring(aDate.lastIndexOf(' ') + 1);

                return (
                    a.idTeacher === teacherId &&
                    a.idClass !== null &&
                    day.toLowerCase() === assistDay &&
                    year === assistYear
                );
            })
            .map((a) => a.idClass);

        const classesByTeacherId = classesDb
            .filter((c) => classesInactives.includes(c.id));

        let classes: ClassAssist[] = [];
        let assists: IAssists[] = [];

        if (classesByTeacherId.length === 0) return response;
        for (let classe of classesByTeacherId) {
            const classeDance = classe.dance;
            const classeId = classe.id;
            let assistStat: StudentsAssists[] = [];
            assists = assistsDb.filter((assist) => assist.idClass == classeId);
            if (assists.length > 0) {
                const assistByDay = assists.filter((a) => {
                    const date = a.date.toString();
                    const assistDay = date.substring(0, date.indexOf(',')).trim();
                    const assistYear = date.substring(date.lastIndexOf(' ') + 1);

                    return (
                        a.idClass === classeId &&
                        assistDay.toLocaleLowerCase() === day.toLocaleLowerCase() &&
                        assistYear === year
                    );
                });

                if (assistByDay.length > 0) {
                    for (let assist of assistByDay) {
                        const asDate = assist.date.toString();
                        const day = asDate.substring(asDate.indexOf(',') + 2, asDate.indexOf(' de')).trim();
                        const month = asDate
                            .substring(asDate.indexOf(' de ') + 4, asDate.lastIndexOf(' de'))
                            .trim();

                        if (assist.absent && assist.absent.length > 0) {
                            for (let studentId of assist.absent) {
                                let isContact = false;
                                let student: any = await getStudentByIdRepository(studentId);
                                if (!student) {
                                    student = await getContactByIdRepository(studentId);
                                    isContact = true;
                                };
                                if (!student) continue;

                                if (assistStat.length > 0 && assistStat.some((a) => a.studentId === student.id)) {
                                    const as = assistStat.filter((a) => a.studentId === student.id)[0];
                                    as.studentAssists.push({
                                        date: asDate,
                                        status: 'A',
                                        month,
                                        day: +day,
                                    });
                                } else {
                                    const studentStat: StudentsAssists = {
                                        studentId,
                                        studentName: `${student.name} ${student.lastName} ${isContact ? '(contacto)' : ''}`,
                                        studentAssists: [{ date: asDate, status: 'A', month, day: +day }],
                                        studentStatus: classe.students.includes(studentId) ? 'activo' : 'inactivo',
                                    };
                                    assistStat.push(studentStat);
                                }
                            }
                        }
                        if (assist.disease && assist.disease.length > 0) {
                            for (let studentId of assist.disease) {
                                let isContact = false;
                                let student: any = await getStudentByIdRepository(studentId);
                                if (!student) {
                                    student = await getContactByIdRepository(studentId);
                                    isContact = true;
                                };
                                if (!student) continue;

                                if (assistStat.length > 0 && assistStat.some((a) => a.studentId === student.id)) {
                                    const as = assistStat.filter((a) => a.studentId === student.id)[0];
                                    as.studentAssists.push({ date: asDate, status: 'E', month, day: +day });
                                } else {
                                    const studentStat: StudentsAssists = {
                                        studentId,
                                        studentName: `${student.name} ${student.lastName} ${isContact ? '(contacto)' : ''}`,
                                        studentAssists: [{ date: asDate, status: 'E', month, day: +day }],
                                        studentStatus: classe.students.includes(studentId) ? 'activo' : 'inactivo',
                                    };
                                    assistStat.push(studentStat);
                                }
                            }
                        }
                        if (assist.missing && assist.missing.length > 0) {
                            for (let studentId of assist.missing) {
                                let isContact = false;
                                let student: any = await getStudentByIdRepository(studentId);
                                if (!student) {
                                    student = await getContactByIdRepository(studentId);
                                    isContact = true;
                                };
                                if (!student) continue;

                                if (assistStat.length > 0 && assistStat.some((a) => a.studentId === student.id)) {
                                    const as = assistStat.filter((a) => a.studentId === student.id)[0];
                                    as.studentAssists.push({
                                        date: asDate,
                                        status: 'Aa',
                                        month,
                                        day: +day,
                                    });
                                } else {
                                    const studentStat: StudentsAssists = {
                                        studentId,
                                        studentName: `${student.name} ${student.lastName} ${isContact ? '(contacto)' : ''}`,
                                        studentAssists: [{ date: asDate, status: 'Aa', month, day: +day }],
                                        studentStatus: classe.students.includes(studentId) ? 'activo' : 'inactivo',
                                    };
                                    assistStat.push(studentStat);
                                }
                            }
                        }
                        if (assist.presents && assist.presents.length > 0) {
                            for (let studentId of assist.presents) {
                                let isContact = false;
                                let student: any = await getStudentByIdRepository(studentId);
                                if (!student) {
                                    student = await getContactByIdRepository(studentId);
                                    isContact = true;
                                };
                                if (!student) continue;

                                if (assistStat.length > 0 && assistStat.some((a) => a.studentId === student.id)) {
                                    const as = assistStat.filter((a) => a.studentId === student.id)[0];
                                    as.studentAssists.push({ date: asDate, status: 'P', month, day: +day });
                                } else {
                                    const studentStat: StudentsAssists = {
                                        studentId,
                                        studentName: `${student.name} ${student.lastName} ${isContact ? '(contacto)' : ''}`,
                                        studentAssists: [{ date: asDate, status: 'P', month, day: +day }],
                                        studentStatus: classe.students.includes(studentId) ? 'activo' : 'inactivo',
                                    };
                                    assistStat.push(studentStat);
                                }
                            }
                        }
                    }
                }
            }
            classes.push({
                id: classeId,
                dance: classeDance,
                assists: assistStat,
            });
        }
        response.ClassAssist = classes;
        return response;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}

export const getPagedListAvgAssistsRepository = async (search: SearchPagedListAvgAssists): Promise<PagedListAvgAssists> => {
    const response = new PagedListAvgAssists();
    try {
        const students = await getStudentsRepository()
        const teachers = await getTeachersRepository()
        let arrayPersons = []
        if (search.Student) arrayPersons.push(...search.Student)
        if (search.Teacher) arrayPersons.push(...search.Teacher)
        let personsFiltered = generateArrayPersons(arrayPersons, students, teachers)
        personsFiltered = await Promise.all(personsFiltered.map(async (person) => {
            let assists = (await getAssistsByPersonId(person.id)).Items;

            if (search.StartDate && search.EndDate) {
                assists = assists.filter(d => {
                    const assistDate = normalizeDate(formatDateToDate(d.date as string));
                    return assistDate >= search.StartDate! && assistDate <= search.EndDate!;
                })
            }

            if (assists.length === 0) {
                person.reason = 'Sin asistencias';
            } else {
                const presents = assists.filter((a) => a.presents.includes(person.id)).length;
                person.avgAssists = Math.round((presents / assists.length) * 100);
                person.reason =
                    presents === assists.length
                        ? 'Asistencias completas ! '
                        : checkReason(assists, person.id);
            }

            return person;
        }));

        personsFiltered = personsFiltered.filter((p) => p.avgAssists !== 0 && p.reason !== 'Sin asistencias');

        if (search.Status && search.Status !== 'all') {
            personsFiltered = personsFiltered.filter(p => p.status === search.Status)
        }

        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedAvgAssists: IPagedListAvgAssist[] = personsFiltered.slice(startIndex, endIndex);

        response.Items = paginatedAvgAssists;
        response.TotalItems = personsFiltered.length;
        response.PageSize = limit;
        response.Students = students.map(s => ({ id: s.id, name: `${s.name} ${s.lastName}` }));
        response.Teachers = teachers.map(t => ({ id: t.id, name: `${t.name} ${t.lastName}` }));
        return response;
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}

export const getHistoryClassesRepository = async (year: string, monthStart: number, monthEnd: number): Promise<HistoryClassesResponse> => {
    const response = new HistoryClassesResponse();
    try {
        const [classes, assists, teachers, hours, ranges] = await Promise.all([
            getClasses(),
            getAssistsRepository(),
            getTeachersRepository(),
            getHoursFromConfigRepository(),
            getRangesFromConfigRepository()]);
        response.ClassesFiltered = getHisoryClassByAssistDate(year, monthStart, monthEnd, assists, classes);
        response.Hours = hours;
        response.Ranges = ranges;
        response.ColorTeachers = teachers.map(t => ({ Id: t.id, Color: t.color }));
        return response;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}

export const getPagedListSaleStatsRepository = async (search: SearchPagedListSalesStats): Promise<PagedListSalesStats> => {
    const response = new PagedListSalesStats();
    try {
        let sales = await getSalesRepository();
        let students = await getStudentsRepository();
        let products = (await getProductsRepository()).Items

        if (search.StartDate && search.EndDate) {
            sales = sales.filter((d: Sale) => {
                const assistDate = normalizeDate(formatDateToDate(d.saleDate as string));
                return assistDate >= search.StartDate! && assistDate <= search.EndDate!;
            })
        }
        if (search.Student && search.Student !== 'undefined') {
            sales = sales.filter((sale) => sale.personId === search.Student);
        }

        if (search.Product && search.Product !== 'undefined') {
            sales = sales.filter((sale) => sale.items.some((item) => item.id === search.Product));
        }


        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedSaleStats: IPagedListSalesStat[] = sales.map(s => {
            const student = students.find(st => st.id === s.personId)
            return {
                id: s.id,
                date: s.saleDate,
                fullName: student ? `${student.name} ${student.lastName}` : '',
                quantityProducts: s.items.reduce((acc, item) => acc + item.quantity, 0),
                amount: s.total,
                products: s.items,
                isCtaCte: s.ctaCte,
                paymentMethods: s.paymentMethod!
            }
        }).slice(startIndex, endIndex);

        response.Items = paginatedSaleStats;
        response.TotalItems = sales.length;
        response.PageSize = limit;
        response.Students = students.map(s => ({ id: s.id, name: `${s.name} ${s.lastName}` }));
        response.Products = products.map(t => ({ id: t.id, name: t.name }));
        return response;
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}

export const getPagedListAccountsExpirationRepository = async (search: SearchPagedListAccountExpirations): Promise<PagedListAccountExpirations> => {
    const response = new PagedListAccountExpirations();
    try {
        let accountsPaid = (await getStudentsAccounts()).Items.reverse()
            .filter((a) => a.status === 'paid');
        let expirationDays = Number((await getExpirationDaysFromConfigRepository())[0].name)

        const latestAccounts = new Map<string, any>();

        accountsPaid.forEach((account) => {
            const existingAccount = latestAccounts.get(account.idPerson);
            let accountDate = new Date();
            if (account.settleDate) {
                accountDate = formatDateToDate(account.settleDate as string);
            }
            if (!existingAccount || new Date(accountDate) > new Date(existingAccount.settleDate)) {
                latestAccounts.set(account.idPerson, account);
            }
        });
        let accounts = Array.from(latestAccounts.values()).filter((a) => {
            if (a.settleDate !== null) {
                const date = search.IsSearchByDate && search.Date ? search.Date : new Date();
                const accountDate = formatDateToDate(a.settleDate as string);
                const datesDifference = Math.floor(
                    (date.getTime() - accountDate.getTime()) / (1000 * 60 * 60 * 24),
                );
                a.difference = datesDifference;
                const nextPaymentDate = new Date(accountDate);
                nextPaymentDate.setDate(nextPaymentDate.getDate() + expirationDays);
                a.nextPaymentDate = nextPaymentDate;
                return search.IsSearchByDate ? datesDifference === expirationDays : true;
            }
            return false;
        });

        if (accounts.length > 0) {
            accounts = await Promise.all(accounts.map(async (a) => {
                const student = await getStudentByIdRepository(a.idPerson);
                return {
                    id: a.idPerson,
                    name: `${student?.name} ${student?.lastName}`,
                    lastPaymentAmount: a.amount,
                    lastPaymentDate: a.settleDate as string,
                    isExpiration: a.difference >= 30,
                    nextPaymentDate: format(a.nextPaymentDate, 'full'),
                };
            }));
        }


        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedSaleStats = accounts.slice(startIndex, endIndex);

        response.Items = paginatedSaleStats;
        response.TotalItems = accounts.length;
        response.PageSize = limit;
        return response;
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}
