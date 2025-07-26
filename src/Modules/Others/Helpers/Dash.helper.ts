import { IAssists } from "../../Assists/Models/Assists.models";
import { IClasses } from "../../Classes/Models/classes.models";
import { getClassByIdRepository } from "../../Classes/Repository/Classes.repository";
import { getReasonByIdRepository } from "../../Config/Repository/Config.repository";
import { ActivityToStat, IContactsActivities } from "../../Contacts/Models/Contact.models";
import { getContactByIdRepository, getFullNameContactById } from "../../Contacts/Repository/Contacts.repository";
import { IStudents, ISudentsDash } from "../../Students/Models/Students.models";
import { ITeachers } from "../../Teachers/Models/Teachers.models";
import { getFullNameUserIdById, getUserByIdRespository } from "../../Users/Repository/User.repository";
import { getDifferenceInDays } from "./DifferenceInDays";
import { formatDateToDate } from "./FormatDateToDate";
import { months, week } from "./Others";

export const getStudentsByStatusHelper = async (
    students: IStudents[],
    month: string,
    status: string,
    currentYear: string
): Promise<ISudentsDash[]> => {  // 🔹 Se cambió Promise<ISudentsDash> a Promise<ISudentsDash[]>

    const filteredStudents = students.filter((student) => {
        let studentDate;
        if (status === 'activo') {
            studentDate = student.createDate?.toString();
        }
        if (status === 'inactivo') {
            studentDate = student.inactiveDate?.toString();
        }
        if (status === 'recuperado') {
            studentDate = student.activatedDate
                ? student.activatedDate.toString()
                : '1 de enero de 1000';
        }

        if (!studentDate) return false; // Evita errores si studentDate es undefined

        const studentDateMonth = studentDate.substring(
            studentDate.indexOf(' de ') + 4,
            studentDate.lastIndexOf(' de'),
        );
        const studentDateYear = studentDate.substring(studentDate.lastIndexOf(' ') + 1);
        return studentDateMonth === month && studentDateYear === currentYear;
    });

    let uniqueClassesId = Array.from(new Set(filteredStudents.map((a) => a.classes?.map((c) => c) || []).flat()));
    let classesPromise = uniqueClassesId.map(async (id) => await getClassByIdRepository(id));
    let classesMap = await Promise.all(classesPromise);

    return await Promise.all(filteredStudents.map(async (s) => {
        return {
            id: s.id,
            displayName: `${s.name} ${s.lastName}`,
            createdDate: s.createDate ? s.createDate.toString() : "",
            inactiveDate: s.inactiveDate ? s.inactiveDate.toString() : "",
            reason: s.idReason ? (await getReasonByIdRepository(s.idReason)).name : "",
            observationsInactive: s.observationsInactive || "",
            classes: classesMap?.map((c) => {
                return {
                    schedule: `${week[c.days[0]]} ${c.schedule}hs. - ${c.lounge}`,
                    classe: c.dance
                }
            }) || []
        };
    }));
}



export const filterDate = (date: string) => {
    const currentMonth = months[new Date().getMonth()].name.toLowerCase();
    const currentYear = new Date().getFullYear();

    const monthMove = date.substring(date.indexOf(' de ') + 4, date.lastIndexOf(' de'));
    const yearMove = date.substring(date.lastIndexOf(' ') + 1);
    return monthMove === currentMonth && yearMove === currentYear.toString();
}

export const generateAvgStudents = (classes: IClasses[]): number => {
    const classesWhitStudents = classes.filter((c) => c.students.length > 0);
    return Math.round(
        classesWhitStudents.reduce((acc, c) => acc + c.students.length, 0) /
        classesWhitStudents.length,
    );
}

export const generateAvgAssist = (as: IAssists[]): number => {
    let assists = as.map((a) => {
        const numberOfAssists =
            a.absent.length +
            a.disease.length +
            a.missing.length +
            a.presents.length +
            a.proofClass.length;
        const numberOfPresents = a.presents.length;
        return (numberOfPresents * 100) / numberOfAssists;
    });
    return Math.round(assists.reduce((acc, a) => acc + a, 0) / assists.length);
}

export const getActivitiesToCompleteToday = async (
    activities: IContactsActivities[],
    date: Date
): Promise<ActivityToStat[]> => {
    const limitDate = new Date(date);

    const activitiesToComplete = activities.filter((activity) => {
        if (activity.fulfillDate === null) {
            const dateActivity = formatDateToDate(activity.nextContactDate?.toString());
            return getDifferenceInDays(dateActivity, limitDate) === 0;
        }
        return false;
    });

    let uniquePersonIds = Array.from(new Set(activitiesToComplete.map((m) => m.contactId)));
    let uniqueUsersIds = Array.from(new Set(activitiesToComplete.map((m) => m.userId)));
    let personsPromise = uniquePersonIds.map(async (id) => await getContactByIdRepository(id));
    let UsersPromise = uniqueUsersIds.map(async (id) => await getUserByIdRespository(id));
    let contacts = await Promise.all(personsPromise);
    let users = await Promise.all(UsersPromise);

    const result: ActivityToStat[] =
        activitiesToComplete.map((act) => ({
            ...act,
            contactName: contacts.find((c) => c?.id === act.contactId)?.name || "",
            userName: users.find((u) => u?.id === act.userId)?.name || "",
        }))


    return result;
};
export const getActivitiesToComplete = async (
    activities: IContactsActivities[],
    date: Date
): Promise<ActivityToStat[]> => {
    const limitDate = new Date(date);

    const activitiesToComplete = activities.filter((activity) => {
        if (activity.fulfillDate === null) {
            const dateActivity = formatDateToDate(activity.nextContactDate?.toString());
            return getDifferenceInDays(dateActivity, limitDate) > 0;
        }

        return false;
    });

    let uniquePersonIds = Array.from(new Set(activitiesToComplete.map((m) => m.contactId)));
    let uniqueUsersIds = Array.from(new Set(activitiesToComplete.map((m) => m.userId)));
    let personsPromise = uniquePersonIds.map(async (id) => await getContactByIdRepository(id));
    let UsersPromise = uniqueUsersIds.map(async (id) => await getUserByIdRespository(id));
    let contacts = await Promise.all(personsPromise);
    let users = await Promise.all(UsersPromise);

    const result: ActivityToStat[] =
        activitiesToComplete.map((act) => ({
            ...act,
            contactName: contacts.find((c) => c?.id === act.contactId)?.name || "",
            userName: users.find((u) => u?.id === act.userId)?.name || "",
        }))


    return result;
};


export const getActivitiesComplete = async (
    activities: IContactsActivities[],
    date: Date
): Promise<ActivityToStat[]> => {
    const limitDate = new Date(date);

    const activitiesComplete = activities.filter((activity) => {
        if (activity.fulfillDate !== null) {
            const dateActivity = formatDateToDate(activity.fulfillDate?.toString());
            return getDifferenceInDays(dateActivity, limitDate) === 0;
        }

        return false;
    });
    let uniquePersonIds = Array.from(new Set(activitiesComplete.map((m) => m.contactId)));
    let uniqueUsersIds = Array.from(new Set(activitiesComplete.map((m) => m.userId)));
    let personsPromise = uniquePersonIds.map(async (id) => await getContactByIdRepository(id));
    let UsersPromise = uniqueUsersIds.map(async (id) => await getUserByIdRespository(id));
    let contacts = await Promise.all(personsPromise);
    let users = await Promise.all(UsersPromise);

    const result: ActivityToStat[] =
        activitiesComplete.map((act) => ({
            ...act,
            contactName: contacts.find((c) => c?.id === act.contactId)?.name || "",
            userName: users.find((u) => u?.id === act.userId)?.name || "",
        }))


    return result;
};
