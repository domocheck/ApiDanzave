import { IAssists } from "../../Assists/Models/Assists.models";
import { Classes, IClasses } from "../../Classes/Models/classes.models";
import { getClassByIdRepository } from "../../Classes/Repository/Classes.repository";
import { IStudents } from "../../Students/Models/Students.models";
import { ITeachers } from "../../Teachers/Models/Teachers.models";
import { IPagedListAvgAssist } from "../Models/Stats/Avg-Assists-paged-list.model";
import { months } from "./Others";

export const generateArrayPersons = (personsSelected: string[], students: IStudents[], teachers: ITeachers[]): IPagedListAvgAssist[] => {
    let persons: IPagedListAvgAssist[] = [
        ...students.map((student) => {
            return {
                fullName: student.name + ' ' + student.lastName,
                avgAssists: 0,
                type: 'Alumno',
                id: student.id,
                status: student.status!,
                reason: '',
            };
        }),
        ...teachers.map((teacher) => {
            return {
                fullName: teacher.name + ' ' + teacher.lastName,
                avgAssists: 0,
                type: 'Maestra',
                id: teacher.id,
                status: teacher.status!,
                reason: '',
            };
        }),
    ];
    if (personsSelected.length > 0) {
        persons = persons.filter((person) => personsSelected.includes(person.id));
    }
    return persons;
}

export const checkReason = (assists: IAssists[], personId: string): string => {
    let absents = 0;
    let diseases = 0;
    let missing = 0;

    for (let assist of assists) {
        if (assist.absent.includes(personId)) absents++;
        if (assist.disease.includes(personId)) diseases++;
        if (assist.missing.includes(personId)) missing++;
    }

    if (diseases > absents && diseases > missing) {
        return 'enfermedad';
    } else if (missing > absents && missing > diseases) {
        return 'con aviso';
    } else if (absents > diseases && absents > missing) {
        return 'sin aviso';
    } else {
        return 'sin razón dominante'; // En caso de empate o ausencia de registros
    }
}

export const getHisoryClassByAssistDate = async (yearStat: string, monthStart: number, monthEnd: number, assists: IAssists[]): Promise<IClasses[]> => {
    const monthsValues = months;
    const result = [] as IClasses[];
    const assistsBetweenDate = assists.filter((a) => {
        const assistDate = a.date.toString();
        const mes = assistDate
            .substring(assistDate.indexOf(' de ') + 4, assistDate.lastIndexOf(' de'))
            .trim()
            .toLowerCase();
        const año = assistDate.substring(assistDate.lastIndexOf(' ') + 1).trim();

        const monthAssist = monthsValues.filter((m) => m.name.toLowerCase() === mes)[0]?.value ?? 0;

        return (
            año === yearStat &&
            monthAssist >= monthStart &&
            monthAssist <= monthEnd &&
            a.idClass !== null &&
            [...a.absent, ...a.disease, ...a.missing, ...a.presents, ...a.proofClass].length > 0
        );
    });

    const classesIds = [...new Set(assistsBetweenDate.map((a) => a.idClass))];
    const classesPromise = classesIds.map(async (id) => {
        return await getClassByIdRepository(id);
    })

    const classes = await Promise.all(classesPromise);

    for (let classe of classes) {
        const newClasse: IClasses = { ...classe };
        newClasse.students = [
            ...new Set([
                ...assistsBetweenDate
                    .filter((a) => a.idClass === classe.id)
                    .map((a) => {
                        // Filtrar los estudiantes para que no se incluyan los idTeacher ni idTeacherSustitute
                        const allStudents = [
                            ...a.absent,
                            ...a.disease,
                            ...a.missing,
                            ...a.presents,
                            ...a.proofClass,
                            ...(a.recovers || []),
                        ];

                        return allStudents.filter(
                            (studentId) => studentId !== a.idTeacher && studentId !== a.idTeacherSustitute,
                        );
                    })
                    .flat(),
            ]),
        ];
        newClasse.idTeacher = classe.idTeacher
            ? classe.idTeacher
            : assistsBetweenDate.filter((a) => a.idClass === classe.id)[0].idTeacher;
        result.push(newClasse);
    }

    return result;
}