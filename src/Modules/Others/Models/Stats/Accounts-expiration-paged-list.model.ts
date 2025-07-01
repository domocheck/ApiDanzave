import { ResponseMessages } from "../ResponseMessages";

export class SearchPagedListAccountExpirations {
    Page: number = 1;
    Date?: Date;
    IsSearchByDate: boolean = true;
}

export interface IPagedListAccountExpiration {
    id: string;
    fullName: string;
    lastPaymentAmount: number;
    lastPaymentDate: string;
    nextPaymentDate: string;
    isExpiration: boolean;
}

export class PagedListAccountExpirations extends ResponseMessages {
    Items: IPagedListAccountExpiration[] = [];
    TotalItems = 0;
    PageSize = 0;
}