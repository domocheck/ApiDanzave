import { Classes } from "../../Classes/Models/classes.models";
import { Students } from "../../Students/Models/Students.models";
import { Teachers } from "../../Teachers/Models/Teachers.models";

export type Person = Students | Classes | Teachers;
