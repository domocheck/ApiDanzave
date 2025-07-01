import { ResponseMessages } from "../../Others/Models/ResponseMessages";

export class Assists extends ResponseMessages {
    Items: IAssists[] = [];
    TotalItems: number = 0;
}

export class HistoryAssists extends ResponseMessages {
    NameStudent: string = "";
    Items: AssistByStudent[] = [];
    TotalItems: number = 0;
}

export class HistoryAssistsTeacher extends ResponseMessages {
    NameTeacher: string = "";
    Items: AssistByTeacher[] = [];
    TotalItems: number = 0;
}

export interface IAssists {
    id: string;
    idClass: string;
    date: Date | string;
    presents: string[];
    missing: string[];
    absent: string[];
    disease: string[];
    proofClass: string[];
    idTeacher: string;
    idTeacherSustitute?: string;
    recovers?: string[];
}

export class AssistByStudent {
    date!: string | Date;
    danceClasse!: string;
    classId!: string;
    nameStudent!: string;
    status!: string;
}

export class AssistByTeacher {
    date!: string | Date;
    danceClasse!: string;
    nameTeacher!: string;
    status!: string;
}

export class AssistPerson {
    idPerson!: string;
    idPersonSustitute?: string;
    idAssist!: string;
    type!: string;
    status!: string;
}

export interface StudentsAssists {
    studentName: string;
    studentId: string;
    studentStatus: string;
    studentAssists: StudentAssitsStats[];
}

export interface StudentAssitsStats {
    status: string;
    date: string;
    month: string;
    day: number;
}

