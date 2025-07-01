import { IActivity } from "../../Activities/Models/Activities.models";
import { IClasses } from "../../Classes/Models/classes.models";
import { Ranges } from "../../Config/Models/Config.models";
import { ColorsTeachers } from "../../Teachers/Models/Teachers.models";
import { ResponseMessages } from "./ResponseMessages";

export class ScheduleInfo extends ResponseMessages {
    Classes!: IClasses[];
    Activities!: IActivity[];
    Hours!: ScheduleHours[];
    ColorsTeachers!: ColorsTeachers[];
    Ranges: Ranges = {} as Ranges;
}

export interface CalendarCell {
    time: string | null;
    class?: string | null;
    rowSpan: number;
    lounge?: string;
    schedule?: number;
    students?: number;
    color?: string | null;
    rangesStudents: string | null;
    id: string;
}

export interface CalendarDay {
    dayName: string;
    salon1: CalendarCell[];
    salon2: CalendarCell[];
    salon3: CalendarCell[];
}

export interface CalendarData {
    days: CalendarDay[];
}

export interface ScheduleHours {
    day: string;
    initialHour: number;
    finalHour: number;
}
