import { IAssists } from "../Models/Assists.models";

export const checkPresence = (student: string, assist: IAssists): string => {
    if (assist) {
        if (assist.presents.includes(student)) return 'presente';
        if (assist.missing.includes(student)) return 'ausente con aviso';
        if (assist.disease.includes(student)) return 'ausente por enfermedad';
        if (assist.absent.includes(student)) return 'ausente sin aviso';
        if (assist.proofClass.includes(student)) return 'clase de prueba';
    }
    return 'sin asistencia';
}
