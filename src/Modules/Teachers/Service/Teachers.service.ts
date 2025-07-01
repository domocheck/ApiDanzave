import { addTeacherToClassRepository, getClassByIdRepository, getClassesGropuedRepository } from "../../Classes/Repository/Classes.repository";
import { getTeachersPricesByStatusRepository } from "../../Config/Repository/Config.repository";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { ChangeStatusPerson } from "../../Students/Models/Students.models";
import { PagedListTeachers, SearchPagedListTeachers } from "../Models/Teachers-paged-list.models";
import { ITeachers, OptionsFormTeacher, Substitutes, Teachers } from "../Models/Teachers.models";
import { changeStatusTeacherRepository, getPagedListTeachersRepository, getSubstitutesRepository, getTeacherById, replaceTeacherRepository, saveTeacherRepository } from "../Repository/Teachers.repository";

export const getSubstitutesService = async (teacherId: string): Promise<Substitutes> => {
    return await getSubstitutesRepository(teacherId);
}

export const getPagedListTeachersService = async (search: SearchPagedListTeachers): Promise<PagedListTeachers> => {
    return await getPagedListTeachersRepository(search);
}

export const changeStatusTeachersService = async (changeStatus: ChangeStatusPerson): Promise<ResponseMessages> => {
    return await changeStatusTeacherRepository(changeStatus);
}

export const getTeacherByIdService = async (teacherId: string): Promise<Teachers> => {
    let response = new Teachers();
    const Teacher = await getTeacherById(teacherId);
    response.Items = [Teacher];
    return response;
}

export const getOptionsFormTeacherService = async (): Promise<OptionsFormTeacher> => {
    let response = new OptionsFormTeacher();
    const [classesGrouped, teachersPrice] = await Promise.all([getClassesGropuedRepository(), getTeachersPricesByStatusRepository('activo')]);
    response.ClassesGropued = classesGrouped;
    response.Prices = teachersPrice;
    return response;
}

export const saveTeacherService = async (teacher: ITeachers): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    const existingTeacher = await getTeacherById(teacher.id);
    let classesToModify: string[] = [];

    if (existingTeacher) {
        const classesAdded = teacher!.classes?.filter(
            (classe) => !existingTeacher!.classes?.includes(classe),
        );

        if (classesAdded && classesAdded.length > 0) {
            classesToModify = classesAdded;
        }
    } else {
        if (teacher.classes && teacher.classes.length > 0) {
            classesToModify = teacher.classes;
        }
    }
    for (let classe of classesToModify) {
        try {
            const currentClass = await getClassByIdRepository(classe);
            console.log(currentClass)
            console.log(teacher)
            if (currentClass!.idTeacher && currentClass!.idTeacher !== teacher.id) {
                await replaceTeacherRepository(
                    currentClass!.idTeacher,
                    teacher.id,
                    currentClass!.id,
                );
            } else {
                await addTeacherToClassRepository(classe, teacher.id);
            }
        } catch (error: any) {
            response.setError(error.message);
            return response;
        }
    }

    return await saveTeacherRepository(teacher)
}
