import { ClassAssist, IClasses } from "../../../Classes/Models/classes.models";
import { Ranges } from "../../../Config/Models/Config.models";
import { ColorsTeachers } from "../../../Teachers/Models/Teachers.models";
import { ResponseMessages } from "../ResponseMessages";
import { ScheduleHours } from "../Schedule";

export class HistoryClassesResponse extends ResponseMessages {
    ClassesFiltered: IClasses[] = [];
    Hours: ScheduleHours[] = [];
    ColorTeachers: ColorsTeachers[] = [];
    Ranges: Ranges = {} as Ranges
}

export class HistoryAssistsResponse extends ResponseMessages {
    ClassAssists: ClassAssist = {} as ClassAssist
}