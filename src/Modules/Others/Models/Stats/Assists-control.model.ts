import { Assists, IAssists } from "../../../Assists/Models/Assists.models";
import { ClassAssist } from "../../../Classes/Models/classes.models";
import { ITeachers } from "../../../Teachers/Models/Teachers.models";
import { ResponseMessages } from "../ResponseMessages";

export class AssistsControlFilteringOptions extends ResponseMessages {
    Teachers: ITeachers[] = [];
    Assists: IAssists[] = [];
}

export class AssistsControlResponse extends ResponseMessages {
    ClassAssist: ClassAssist[] = [];
}