import { Assists, IAssists, StudentsAssists } from "../../Assists/Models/Assists.models";
import { NameAndId, NameAndValue } from "../../Others/Models/Others";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { StudentsActives } from "../../Students/Models/Students.models";
import { TeachersActive } from "../../Teachers/Models/Teachers.models";

export class Classes extends ResponseMessages {
    Items: IClasses[] = [];
    TotalItems: number = 0;
}

export class IndClassInfo extends ResponseMessages {
    AssistInd!: IAssists;
    ClassInd!: IClasses;
}

export class PresenceAssist extends ResponseMessages {
    Presences: IPresence[] = [];
    StudentsActives: StudentsActives[] = [];
    LastestAssists: IAssists[] = [];
}

export class ClassesResponse extends ResponseMessages {
    Items: Classes[] = [];
    TotalItems = 0;
}

export class OptionsFormClasse extends ResponseMessages {
    StudentsActives: StudentsActives[] = []
    TeachersActives: TeachersActive[] = []
    Lounges: NameAndValue[] = []
}

export interface IClaseStudentsDash {
    schedule: string;
    classe: string;
}

export interface IPresence {
    id: string;
    name: string;
    presence: string;
    type: string;
    color?: string;
}


export interface IClasses {
    days: number[];
    id: string;
    date?: Date | string | null;
    schedule: number;
    duration: number;
    isRepeat: boolean;
    status: string;
    lounge: string;
    otherPlaces?: string;
    idTeacher: string;
    dance: string;
    students: string[];
    presences?: Assists[];
    color?: string;
    createDate?: Date | string;
    createdDate?: Date | string;
    updateDate?: Date | string;
    inactiveDate?: Date | string;
}

export interface ClassesActives {
    id: string;
    name: string;
    schedule: number;
    duration: number;
    days: string[];
    students: string[];
    lounge: string;
    numberDay: number;
}

export interface GroupedClasses {
    day: string;
    lounge: string;
    classes: ClassesActives[];
}

export interface ClassAssist {
    id?: string;
    dance: string;
    assists: StudentsAssists[];
}