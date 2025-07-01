import { response } from "express";
import { IPagedListUnpaidAccount, PagedListUnpaidAccounts, SearchPagedListUnpaidAccounts } from "../../Accounts/Models/Accounts-paged-list.models";
import { removeStudentFromClass } from "../../Classes/Controller/Classes.controller";
import { addStudentToClassRepository, getClassesGropuedRepository, removeStudentToClassRepository } from "../../Classes/Repository/Classes.repository";
import { getLimit, getStudentsPricesByStatusRepository, getStudentsPricesRepository } from "../../Config/Repository/Config.repository";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { SearchPagedListStudents } from "../Models/Search";
import { ChangeStatusPerson, IStudents, OptionsFormStudent, PagedListStudents, Students, StudentsActivesResponse } from "../Models/Students.models";
import { addRecoverStudentRepository, changeStatusStudentRepository, getPagedListStudentsRepository, getStudentByIdRepository, getStudentsActives, getStudentsByStatus, saveStudentRepository } from "../Repository/StudentsRepository";
import { getStudentsAccounts, getStudentsAccountsByStatus } from "../../Accounts/Repository/Accounts.repository";
import { IAccount } from "../../Accounts/Models/Accounts.models";
import { OptionsFormTeacher } from "../../Teachers/Models/Teachers.models";
import { getContactByIdRepository, saveContactRepository } from "../../Contacts/Repository/Contacts.repository";
import { fulfillActivityRepository } from "../../ContactsActivities/Repository/ContactsActivitiesRepository";
import { format } from "@formkit/tempo";

export const addRecoverStudentService = async (studentId: string, assistId: string): Promise<ResponseMessages> => {
    return await addRecoverStudentRepository(studentId, assistId);
}

export const getPagedListStudentsService = async (search: SearchPagedListStudents): Promise<PagedListStudents> => {
    return await getPagedListStudentsRepository(search);
}

export const changeStatusStudentService = async (changeStatus: ChangeStatusPerson): Promise<ResponseMessages> => {
    return await changeStatusStudentRepository(changeStatus);
}

export const getOptionsFormStudentService = async (): Promise<OptionsFormStudent> => {
    let response = new OptionsFormStudent();
    const [classesGrouped, studentsPrice] = await Promise.all([getClassesGropuedRepository(), getStudentsPricesByStatusRepository('activo')]);
    response.ClassesGropued = classesGrouped;
    response.Prices = studentsPrice.filter(sp => !sp.name.toLowerCase().includes('matricula'))
    response.TuitionPrices = studentsPrice.filter(sp => sp.name.toLowerCase().includes('matricula'))
    return response;
}

export const saveStudentService = async (student: IStudents): Promise<ResponseMessages> => {
    const existingStudent = await getStudentByIdRepository(student.id);
    if (existingStudent) {
        const classesAdded = student!.classes?.filter(
            (classe) => !existingStudent!.classes?.includes(classe),
        );
        const classesRemoved = existingStudent!.classes?.filter(
            (classe) => !student!.classes?.includes(classe),
        );

        // Actualizar el estudiante

        // Agregar el estudiante a las nuevas clases
        if (classesAdded && classesAdded.length > 0) {
            for (let classe of classesAdded) {
                await addStudentToClassRepository(classe, student.id);
            }
        }
        // Quitar el estudiante de las clases antiguas
        if (classesRemoved && classesRemoved.length > 0) {
            for (let classe of classesRemoved) {
                await removeStudentToClassRepository(classe, student.id);
            }
        }
    } else {
        if (student.classes && student.classes.length > 0) {
            for (const classe of student.classes) {
                await addStudentToClassRepository(classe, student.id);
            }
        }
    }

    return await saveStudentRepository(student)
}

export const getStudentByIdService = async (studentId: string): Promise<Students> => {
    let response = new Students();
    const student = await getStudentByIdRepository(studentId);
    response.Items = [student];
    return response;
}

export const getStudentsActivesService = async (): Promise<StudentsActivesResponse> => {
    let response = new StudentsActivesResponse();
    try {
        const students = await getStudentsActives();
        response.Items = students;
    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
    return response;
}

export const convertedContactToStudentService = async (contactId: string, activityId: string, observations: string = ""): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const contact = await getContactByIdRepository(contactId);
        const res = await fulfillActivityRepository(activityId);
        if (res.hasErrors()) {
            response.setError(res.getErrors()[0])
            return response;
        }

        const newStudent: IStudents = {
            name: contact.name || '',
            lastName: contact.lastName || '',
            email: contact.email || '',
            dni: contact.dni || 0,
            phone: contact.phone || 0,
            id: contact.id || '',
            birthday: contact.birthday || '' || '',
            photo: contact.photo || '',
            isFit: contact.isFit || true,
            parent: contact.parent || {
                address: '',
                email: '',
                lastName: '',
                name: '',
                phone: 0,
            },
            status: contact.status || 'activo',
            classes: [],
            school: contact.school || {
                name: '',
                schedule: 0,
            },
            reference: contact.reference,
            contactMedia: contact.contactMedia,
            monthly: '',
            discount: 0,
            createDate: format(new Date(), 'full'),
            observations,
        };

        if (contact.classes && contact.classes.length > 0) {
            for (let classe of contact.classes) {
                await removeStudentToClassRepository(classe, newStudent.id);
            }
        }

        const updateContact = {
            ...contact,
            toStudentDate: format(new Date(), 'full'),
            status: 'inhabilitado',
        };

        response = await saveContactRepository(updateContact);
        response = await saveStudentRepository(newStudent);

    } catch (error: any) {
        response.setError(error.message);
        return response;
    }

    return response;
}