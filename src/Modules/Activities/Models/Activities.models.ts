import { Assists, IAssists } from "../../Assists/Models/Assists.models";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";

export class IndActivityInfo extends ResponseMessages {
    AssistInd!: IAssists;
    ActivityInd!: IActivity
}

export class Activity extends ResponseMessages {
    Items!: IActivity[];
    TotalItems: number = 0;
}

export class ActivitiesResponse extends ResponseMessages {
    Items: IActivity[] = [];
    TotalItems = 0;
}

export interface CalendarActivity {
    date: string;
    activities: IActivity[];
}

export interface IActivity {
    days: number[];
    id: string;
    date?: Date;
    schedule: number;
    duration: number;
    isRepeat: boolean;
    status: string;
    lounge: string;
    otherPlaces?: string;
    idTeacher: string;
    activity: string;
    students: string[];
    presences?: Precenses[];
    guest?: string;
}

export interface Precenses {
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
}

export interface ActivityActives {
    id: string;
    name: string;
    schedule: number;
    duration: number;
    days: string[];
    students?: string[];
}


