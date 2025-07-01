import { FilteringOptionsAccountsStatus, NameAndId } from "../../Others/Models/Others";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { IAccount } from "./Accounts.models";

export class SearchPagedListAccounts {
    Page: number = 1;
    Name: string = '';
    Status: string = ""
    Type: string = ""
}

export interface IPagedListAccount {
    id: string;
    status: string;
    month: string;
    year: string;
    fullName: string;
    amount: number;
}


export class PagedListAccounts extends ResponseMessages {
    Items: IPagedListAccount[] = [];
    TotalItems = 0;
    TotalDebt = 0;
    TotalPaidAccounts = 0;
    PageSize = 0;
    FilteringOptions: NameAndId[] = new FilteringOptionsAccountsStatus().Items
}
export interface IPagedListUnpaidAccount {
    id: string;
    status: string;
    description: string;
    fullName: string;
    year: number;
    month: number;
    dayPaid: string;
    balance: number;
}

export class PagedListUnpaidAccounts extends ResponseMessages {
    Items: IAccount[] = [];
    TotalItems = 0;
    TotalDebt = 0;
    PageSize = 0;
    FilteringOptions: NameAndId[] = []
}

export class SearchPagedListUnpaidAccounts {
    Page: number = 1;
    Name: string = '';
    Status: string = ""
    Month: number = 0
    Year: number = 0
}