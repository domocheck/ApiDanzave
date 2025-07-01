import { FilteringOptionsStatus, NameAndId } from "../../Others/Models/Others";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";

export class SearchPagedListUsers {
    Page: number = 1;
    Name: string = '';
    Status: string = "";
}

export interface IPagedListUsers {
    id: string;
    status: string;
    name: string;
    role: string;
}

export class PagedListUsers extends ResponseMessages {
    Items: IPagedListUsers[] = [];
    TotalItems = 0;
    PageSize = 0;
    FilteringOptionsStatus: NameAndId[]

    constructor() {
        super();
        this.FilteringOptionsStatus = new FilteringOptionsStatus().Items
    }
}