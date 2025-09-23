import { format } from "@formkit/tempo";
import { addAssistRepository, chargePresencesRepository, checkIsGenerateAssist, getAssistById, getAssistsByClassId, getAssistsByStudentId, getAssistsByTeacherId, getPagedListContactAssistsRepository, getPagedListStudentAssistsRepository, getPagedListTeacherAssistsRepository } from "../Repository/Assists.repository";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { IClasses, IndClassInfo, IPresence, PresenceAssist } from "../../Classes/Models/classes.models";
import { getClassByIdRepository } from "../../Classes/Repository/Classes.repository";
import { formatDateToDate } from "../../Others/Helpers/FormatDateToDate";
import { getFullNameStudentById, getStudentByIdRepository, getStudentsActives } from "../../Students/Repository/StudentsRepository";
import { getFullNameContactById } from "../../Contacts/Repository/Contacts.repository";
import { checkPresence } from "../Helpers/CheckPresence";
import { getFullNameTeacherById, getTeacherById } from "../../Teachers/Repository/Teachers.repository";
import { ValidateHasAssists } from "../Helpers/Validators/Validate-has-assists";
import { ValidateHasClasses } from "../../Classes/Helpers/Validators/Validate.has-classes";
import { AssistByStudent, AssistByTeacher, AssistPerson, HistoryAssists, HistoryAssistsTeacher, IAssists } from "../Models/Assists.models";
import { IndActivityInfo } from "../../Activities/Models/Activities.models";
import { getActivityByIdRepository, getAssistsByActivityId } from "../../Activities/Repository/Activities.repository";
import { TypeClassesEnum } from "../../Classes/Enums/Type-classes.enum";
import { IPagedListHistoryAssistsPerson, PagedListHistoryAssistsPersons, SearchPagedListHistoryAssistsPersons } from "../Models/Assists.-students-paged-list.model";

export const createAssistService = async (idClasses: string[]): Promise<ResponseMessages> => {
    const today = format(new Date(), 'full');
    const response = new ResponseMessages();
    try {
        for (let id of idClasses) {
            const isGenerateAssist = await checkIsGenerateAssist(id, today);
            if (isGenerateAssist) {
                await addAssistRepository(id)
            }
        }
        response.setSuccess('Asistencias creadas con exito');
    } catch (error) {
        response.setError('Error al crear asistencias');
    }
    return response;
}

export const getAssistByClassIdService = async (classId: string): Promise<IndClassInfo> => {
    const day = new Date().getDay();
    const response = new IndClassInfo();
    const classeRequest = await getClassByIdRepository(classId);
    const classe = classeRequest;
    if (!classe) {
        response.setError('No se encontro la clase');
        return response;
    }
    if (classe.days.includes(day)) {
        await addAssistRepository(classe.id);
    }
    const assistClass = (await getAssistsByClassId(classe.id)).Items;
    const asist = assistClass.sort(
        (a, b) =>
            new Date(formatDateToDate(b.date as string)).getTime() -
            new Date(formatDateToDate(a.date as string)).getTime(),
    )[0];

    response.AssistInd = asist;
    response.ClassInd = classe;
    return response;
}

export const getAssistByActivityIdService = async (activityId: string): Promise<IndActivityInfo> => {
    const day = new Date().getDay();
    const response = new IndActivityInfo();
    const activityRequest = await getActivityByIdRepository(activityId);
    const activity = activityRequest;
    if (!activity) {
        response.setWarning('No se encontro la actividad');
        response.ActivityInd = activity;
        response.AssistInd = {} as IAssists;
        return response;
    }
    if (activity?.days?.includes(day)) {
        await addAssistRepository(activity.id);
    }

    const assistClass = (await getAssistsByActivityId(activity.id)).Items;
    const asist = assistClass.sort(
        (a, b) =>
            new Date(formatDateToDate(b.date as string)).getTime() -
            new Date(formatDateToDate(a.date as string)).getTime(),
    )[0] || [];

    response.AssistInd = asist;
    response.ActivityInd = activity;
    return response;
}
export const generatePresenceService = async (classId: string, assistId: string, typeClasse: number): Promise<PresenceAssist> => {
    let response = new PresenceAssist();
    let presences = [] as IPresence[];
    const classeRequest = typeClasse === TypeClassesEnum.Classe ? await getClassByIdRepository(classId) : await getActivityByIdRepository(classId);
    const [assistRequest, studentsActives, assistClass] = await Promise.all(
        [
            getAssistById(assistId),
            getStudentsActives(),
            getAssistsByClassId(classId)
        ]);
    if (!classeRequest || !assistRequest || assistClass.hasErrors()) {
        return response;
    }
    const classe = classeRequest;
    const assist = assistRequest;
    const uniqueStudents = Array.from(new Set(classe.students));

    for (let id of uniqueStudents) {
        let fullName = "";
        fullName = await getFullNameStudentById(id);
        if (!fullName) {
            fullName = await getFullNameContactById(id);
        }
        if (fullName) {
            presences = [...presences, {
                id: id,
                name: fullName,
                presence: checkPresence(id, assist),
                type: fullName.includes('Clase de prueba') ? 'contacts' : 'students',
            }]
        }
    }

    if (classe.idTeacher) {
        const teacher = await getTeacherById(classe.idTeacher);
        presences = [{
            id: teacher.id,
            name: `MAESTRA - ${teacher.name} ${teacher.lastName}`,
            presence: checkPresence(teacher.id, assist),
            type: 'teachers',
            color: teacher.color,
        }, ...presences];
    }

    if (assist.recovers && assist.recovers.length > 0) {
        for (let id of assist.recovers) {
            const student = await getStudentByIdRepository(id);
            presences = [...presences, {
                id: student.id,
                name: `${student.name} ${student.lastName} - Recupera`,
                presence: checkPresence(student.id, assist),
                type: 'students',
            }]
        }
    }

    response.Presences = presences;
    response.StudentsActives = studentsActives
    response.LastestAssists = assistClass.Items.filter(a => a.id !== assistId).slice(0, 10);
    return response;
}

export const chargePresencesService = async (newAssist: AssistPerson): Promise<ResponseMessages> => {
    return await chargePresencesRepository(newAssist);
}

export const getHistoryStudentAssistService = async (search: SearchPagedListHistoryAssistsPersons): Promise<PagedListHistoryAssistsPersons> => {
    return await getPagedListStudentAssistsRepository(search)
}

export const getHistoryTeacherAssistService = async (search: SearchPagedListHistoryAssistsPersons): Promise<PagedListHistoryAssistsPersons> => {
    return await getPagedListTeacherAssistsRepository(search)
}

export const getHistoryContactAssistService = async (search: SearchPagedListHistoryAssistsPersons): Promise<PagedListHistoryAssistsPersons> => {
    return await getPagedListContactAssistsRepository(search)
}
