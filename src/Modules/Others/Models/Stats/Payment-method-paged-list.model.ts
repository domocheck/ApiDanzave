import { NameAndId } from "../Others";
import { ResponseMessages } from "../ResponseMessages";

export class SearchPagedListPaymentMethods {
    Page: number = 1;
    Payment?: string = "";
    StartDate?: Date;
    EndDate?: Date;
}

export interface IPagedListPaymentMethod {
    id: string;
    name: string;
    value: number
}

export class PagedListPaymentMethods extends ResponseMessages {
    Items: IPagedListPaymentMethod[] = [];
    TotalItems = 0;
    TotalPaid = 0;
    PageSize = 0;
    PaymentMethods: NameAndId[] = [];
}