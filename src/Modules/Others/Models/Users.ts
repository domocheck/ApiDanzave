import { TeachersActive } from "../../Teachers/Models/Teachers.models";
import { ResponseMessages } from "./ResponseMessages";

export class UsersResponse extends ResponseMessages {
    Items: User[] = [];
}

export class OptionsFormUsers extends ResponseMessages {
    TeachersActives: TeachersActive[] = [];
    Roles: string[] = [];
}
export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    password?: string;
    status?: string;
    idPerson?: string;
}
