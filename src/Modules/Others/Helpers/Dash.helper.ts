import { IAssists } from "../../Assists/Models/Assists.models";
import { IClasses } from "../../Classes/Models/classes.models";
import { getClassByIdRepository } from "../../Classes/Repository/Classes.repository";
import { getReasonByIdRepository } from "../../Config/Repository/Config.repository";
import { ActivityToStat, IContactsActivities } from "../../Contacts/Models/Contact.models";
import { getFullNameContactById } from "../../Contacts/Repository/Contacts.repository";
import { IStudents, ISudentsDash } from "../../Students/Models/Students.models";
import { ITeachers } from "../../Teachers/Models/Teachers.models";
import { getFullNameUserIdById } from "../../Users/Repository/User.repository";
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

    return await Promise.all(filteredStudents.map(async (s) => {
        return {
            id: s.id,
            displayName: `${s.name} ${s.lastName}`,
            createdDate: s.createDate ? s.createDate.toString() : "",
            inactiveDate: s.inactiveDate ? s.inactiveDate.toString() : "",
            reason: s.idReason ? (await getReasonByIdRepository(s.idReason)).name : "",
            observationsInactive: s.observationsInactive || "",
            classes: await Promise.all(s.classes?.map(async (c) => {
                const classe = await getClassByIdRepository(c);
                return {
                    schedule: `${week[classe.days[0]]} ${classe.schedule}hs. - ${classe.lounge}`,
                    classe: classe.dance
                }
            }) || [])
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

    const result: ActivityToStat[] = await Promise.all(
        activitiesToComplete.map(async (act) => ({
            ...act,
            contactName: await getFullNameContactById(act.contactId),
            userName: await getFullNameUserIdById(act.userId),
        }))
    );

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

    const result: ActivityToStat[] = await Promise.all(
        activitiesToComplete.map(async (act) => ({
            ...act,
            contactName: await getFullNameContactById(act.contactId),
            userName: await getFullNameUserIdById(act.userId),
        }))
    );

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

    const result: ActivityToStat[] = await Promise.all(
        activitiesComplete.map(async (act) => ({
            ...act,
            contactName: await getFullNameContactById(act.contactId),
            userName: await getFullNameUserIdById(act.userId),
        }))
    );

    return result;
};
