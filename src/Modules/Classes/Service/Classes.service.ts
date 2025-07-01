import { ActivitiesResponse, IActivity } from '../../Activities/Models/Activities.models';
import { FilteringOptionsLounges } from '../../Others/Models/Others';
import { ResponseMessages } from '../../Others/Models/ResponseMessages';
import { getStudentsActives } from '../../Students/Repository/StudentsRepository';
import { getTeachersActives } from '../../Teachers/Repository/Teachers.repository';
import { PagedListClasses, SearchPagedListClasses } from '../Models/classes-paged-list-models';
import { PagedListJuvetActivities, SearchPagedListJuvetActivities } from '../Models/juvet-activites-paged-list.model';
import { SearchClasses } from '../Models/search';
import { getPagedListClassesRepository, removeClassToStudentRepository, removeStudentToClassRepository, getClassesRepository, changeClassStatusRepository, getClassByIdRepository, removeClassToTeacherRepository, getClassesByStatusRepository, saveClasseRepository, getJuvetActivityByIdRepository, getJuvetActivitiesRepository, changeJuvetActivityStatusRepository, getPagedListJuvetActivitiesRepository, saveJuvetActivityRepository } from '../Repository/Classes.repository';
import { Classes, IClasses, OptionsFormClasse } from './../Models/classes.models';
export const getClassesService = async (search: SearchPagedListClasses): Promise<Classes> => {
    return await getClassesRepository(search)
}

export const getClasseByIdService = async (classeId: string): Promise<Classes> => {
    let response = new Classes();
    const student = await getClassByIdRepository(classeId);
    response.Items = [student];
    return response;
}

export const removeStudentFromClassService = async (classId: string, studentId: string, type: string): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        // Ejecutar ambas promesas en paralelo
        const [removeStudent, removeClass] = await Promise.all([
            removeStudentToClassRepository(classId, studentId),
            removeClassToStudentRepository(classId, studentId, type),
        ]);

        // Verificar errores en ambas respuestas
        if (removeStudent.hasErrors()) return removeStudent;
        if (removeClass.hasErrors()) return removeClass;

        response.setSuccess("Estudiante removido de la clase con éxito");
    } catch (error) {
        response.setError("Error interno al remover al estudiante");
    }

    return response;
}

export const getPagedListClassesService = async (search: SearchPagedListClasses): Promise<PagedListClasses> => {
    return await getPagedListClassesRepository(search);
}

export const changeClassStatusService = async (classeId: string, newStatus: string): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        if (newStatus === 'inactivo') {
            const classe = await getClassByIdRepository(classeId);

            if (classe.students && classe.students.length > 0) {
                for (let student of classe.students) {
                    response = await removeClassToStudentRepository(classeId, student);
                    if (response.hasErrors()) {
                        response.setError('Error al remover estudiante de la clase');
                        return response;
                    }
                    console.log(student)
                }

            }

            if (classe.idTeacher) {
                response = await removeClassToTeacherRepository(classeId, classe.idTeacher);
                if (response.hasErrors()) {
                    response.setError('Error al remover maestra de la clase');
                    return response;
                }
                console.log(classe.idTeacher)
            }

        } else {
            const classe = await getClassByIdRepository(classeId);
            const hasDisponibility = await checkDisponibility(classe);
            if (!hasDisponibility) {
                response.setError('No hay disponibilidad en la hora seleccionada');
                return response;
            }
        }
        return await changeClassStatusRepository(classeId, newStatus);
    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
}

export const getOptionsFormClasseService = async (): Promise<OptionsFormClasse> => {
    let response = new OptionsFormClasse();

    try {
        const [studentsActives, teachersActives] = await Promise.all([
            getStudentsActives(),
            getTeachersActives()
        ])
        response.StudentsActives = studentsActives;
        response.TeachersActives = teachersActives;
        response.Lounges = new FilteringOptionsLounges().Items;
    } catch (error: any) {
        response.setError(error.message);
        return response;
    }

    return response;
}

export const saveClasseService = async (classe: IClasses): Promise<ResponseMessages> => {
    let response = new ResponseMessages();

    try {
        const hasDisponibility = await checkDisponibility(classe);
        if (!hasDisponibility) {
            response.setError('No hay disponibilidad en la hora seleccionada');
            return response;
        }
        response = await saveClasseRepository(classe);
        return response;
    } catch (error: any) {
        response.setError(error.message);
        return response;
    }

    return response;

}

const checkDisponibility = async (newClasse: IClasses): Promise<boolean> => {
    const [classes] = await Promise.all([
        getClassesRepository({ Status: "activo", Page: 1, Name: "" }),
    ]);
    const initialHourNewClasse = newClasse.schedule;
    const finalHourNewClasse = newClasse.schedule + newClasse.duration / 60;


    const filteredClasses = classes.Items
        .filter(
            (c) =>
                c.lounge === newClasse.lounge &&
                c.days.some((day) => newClasse.days.includes(day)) &&
                c.status === 'activo' &&
                c.id !== newClasse.id,
        )
        .sort((a, b) => a.schedule - b.schedule);


    for (const classe of filteredClasses) {
        const initialHourClasse = classe.schedule;
        const finalHourClasse = classe.schedule + classe.duration / 60;

        if (
            !(
                (initialHourNewClasse < initialHourClasse && finalHourNewClasse <= initialHourClasse) ||
                (initialHourNewClasse >= finalHourClasse && finalHourNewClasse > finalHourClasse)
            )
        ) {
            return false;
        }
    }
    return true;
}

const checkDisponibilitJuvetActivity = async (newClasse: IActivity): Promise<boolean> => {
    const classes = (await getJuvetActivitiesRepository()).filter(c => c.status === 'activo');
    const initialHourNewClasse = newClasse.schedule;
    const finalHourNewClasse = newClasse.schedule + newClasse.duration / 60;


    const filteredClasses = classes
        .filter(
            (c) =>
                c.lounge === newClasse.lounge &&
                c.days.some((day) => newClasse.days.includes(day)) &&
                c.status === 'activo' &&
                c.id !== newClasse.id,
        )
        .sort((a, b) => a.schedule - b.schedule);


    for (const classe of filteredClasses) {
        const initialHourClasse = classe.schedule;
        const finalHourClasse = classe.schedule + classe.duration / 60;

        if (
            !(
                (initialHourNewClasse < initialHourClasse && finalHourNewClasse <= initialHourClasse) ||
                (initialHourNewClasse >= finalHourClasse && finalHourNewClasse > finalHourClasse)
            )
        ) {
            return false;
        }
    }
    return true;
}

export const getPagedListJuvetActivitiesService = async (search: SearchPagedListJuvetActivities): Promise<PagedListJuvetActivities> => {
    return await getPagedListJuvetActivitiesRepository(search);
}

export const changeJuvetActivityStatusService = async (activityId: string, newStatus: string): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const classe = await getJuvetActivityByIdRepository(activityId);
        if (newStatus === 'inactivo') {

            if (classe.students && classe.students.length > 0) {
                for (let student of classe.students) {
                    response = await removeClassToStudentRepository(activityId, student);
                    if (response.hasErrors()) {
                        response.setError('Error al remover estudiante de la clase');
                        return response;
                    }
                    console.log(student)
                }

            }

            if (classe.idTeacher) {
                response = await removeClassToTeacherRepository(activityId, classe.idTeacher);
                if (response.hasErrors()) {
                    response.setError('Error al remover maestra de la clase');
                    return response;
                }
                console.log(classe.idTeacher)
            }

        } else {
            const hasDisponibility = await checkDisponibilitJuvetActivity(classe);
            if (!hasDisponibility) {
                response.setError('No hay disponibilidad en la hora seleccionada');
                return response;
            }
        }
        return await changeJuvetActivityStatusRepository(activityId, newStatus);
    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
}

export const getJuvetActivityByIdService = async (activityId: string): Promise<ActivitiesResponse> => {
    let response = new ActivitiesResponse();
    const activity = await getJuvetActivityByIdRepository(activityId);
    response.Items = [activity];
    return response;
}

export const saveJuvetActivityService = async (activity: IActivity): Promise<ResponseMessages> => {
    let response = new ResponseMessages();

    try {
        const hasDisponibility = await checkDisponibilitJuvetActivity(activity);
        if (!hasDisponibility) {
            response.setError('No hay disponibilidad en la hora seleccionada');
            return response;
        }
        response = await saveJuvetActivityRepository(activity);
        return response;
    } catch (error: any) {
        response.setError(error.message);
        return response;
    }

    return response;

}
