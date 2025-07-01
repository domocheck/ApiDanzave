import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { ScheduleHours } from "../../Others/Models/Schedule";

export class Config extends ResponseMessages {
    Items: IConfig = {} as IConfig
}

export interface IConfig {
    studentsHourlyPrice?: number;
    teachersHourlyPrice?: number;
    roles?: string[];
    quantityPagesToSee?: number;
    hours?: ScheduleHours[];
    ranges?: Ranges;
    paymentsMethods?: IPayments[];
    studentsPrice?: Price[];
    teachersPrice?: Price[];
    references?: Reference[];
    contactMedia?: Reference[];
    reasons?: Reasons[];
    contactStates?: Reasons[];
    categoriesProducts?: ItemsConfig[];
    sizesProducts?: ItemsConfig[];
    colorsProducts?: ItemsConfig[];
    expirationDays?: Reference[];
}

export interface ItemsConfig {
    id?: string;
    name: string;
    type?: string;
}

export interface Reasons {
    id: string;
    name: string;
}

export interface Reference {
    id: string;
    name: string;
}

export interface Ranges {
    bajo: number;
    medio: number;
    intermedio: number;
}

export interface Price {
    id: string;
    name: string;
    regularPrice: number;
    eftPrice: number;
    dispalyName?: string;
    status: string;
}

export interface IPayments {
    id: string;
    name: string;
    type?: string;
    value?: number;
}
