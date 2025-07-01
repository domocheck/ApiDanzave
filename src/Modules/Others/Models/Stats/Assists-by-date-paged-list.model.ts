import { IAssists } from "../../../Assists/Models/Assists.models";
import { ClassesActives, IClasses } from "../../../Classes/Models/classes.models";
import { ResponseMessages } from "../ResponseMessages";

export class AssistsByDateFilteringOptions extends ResponseMessages {
    Classes: ClassesActives[] = [];
}

export class AssistsByDateResponse extends ResponseMessages {
    IndClass!: IClasses;
    IndAssist!: IAssists;
}