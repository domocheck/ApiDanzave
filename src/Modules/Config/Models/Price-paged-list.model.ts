import { FilteringOptionsAccountsStatus, FilteringOptionsStatus, NameAndId } from "../../Others/Models/Others";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";

export class SearchPagedListPrices {
    Page: number = 1;
    Name: string = '';
    Status: string = "";
    Type: string = ""
}

export interface IPagedListPrices {
    id: string;
    status: string;
    name: string;
    regularPrice: number;
    eftPrice: number;
}

export class PagedListPrices extends ResponseMessages {
    Items: IPagedListPrices[] = [];
    TotalItems = 0;
    PageSize = 0;
    FilteringOptionsStatus: NameAndId[]

    constructor() {
        super();
        this.FilteringOptionsStatus = new FilteringOptionsStatus().Items
    }
}