import { ClassesActives } from "../../Classes/Models/classes.models";
import { Price } from "../../Config/Models/Config.models";
import { NameAndId } from "../../Others/Models/Others";
import { ResponseMessages } from "../../Others/Models/ResponseMessages"

export class Teachers extends ResponseMessages {
    Items!: ITeachers[]
    TotalItems: number = 0
}

export class Substitutes extends ResponseMessages {
    Items: NameAndId[] = [];
    TotalItems = 0;
}

export class OptionsFormTeacher extends ResponseMessages {
    ClassesGropued: ClassesActives[] = [];
    Prices: Price[] = [];
}

export interface ITeachers {
    id: string;
    name: string;
    lastName: string;
    birthday: string;
    dni: number;
    phone: number;
    instagram?: string;
    photo?: string | unknown;
    email: string;
    status: string;
    classes: string[];
    activities?: string[];
    monthly: string;
    discount: number;
    color: string;
    observations?: string;
    observationsInactive?: string;
    createDate?: Date | string;
    updateDate?: Date | string;
    inactiveDate?: Date | string;
    idReason?: string;
}

export interface TeachersActive {
    id: string;
    name: string;
    lastName: string;
    displayName: string;
}

export interface ColorsTeachers {
    Color: string | null;
    Id: string;
}