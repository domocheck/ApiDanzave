import { IPayments } from "../../Config/Models/Config.models";
import { NameAndId } from "../../Others/Models/Others";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";

export class SearchPagedListExpenses {
    Page: number = 1;
    Type: string = "";
    StartDate?: Date;
    EndDate?: Date;
}

export interface IPagedListExpense {
    id: string;
    date: string;
    description: string;
    total: number;
    payments: IPayments[];
}

export class PagedListExpenses extends ResponseMessages {
    Items: IPagedListExpense[] = [];
    TotalItems = 0;
    PageSize = 0;
    FilteringOptions: NameAndId[] = [];
    Total = 0;
}