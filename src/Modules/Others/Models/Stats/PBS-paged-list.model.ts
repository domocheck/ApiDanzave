import { IPayments } from "../../../Config/Models/Config.models";
import { NameAndId } from "../Others";
import { ResponseMessages } from "../ResponseMessages";

export class SearchPagedListPBS {
    Page: number = 1;
    Student?: string = "";
    PaymentMethod?: string = "";
    StartDate?: Date;
    EndDate?: Date;
}

export interface IPagedListPBS {
    id: string;
    fullName: string;
    description: string;
    date: string;
    amount: number;
    payments: IPayments[];
}

export class PagedListPBS extends ResponseMessages {
    Items: IPagedListPBS[] = [];
    TotalItems = 0;
    TotalPaid = 0;
    PageSize = 0;
    Students: NameAndId[] = [];
    PaymentMethods: NameAndId[] = [];
}