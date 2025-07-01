import { FilteringOptionsStatus, NameAndId } from "../Others";
import { ResponseMessages } from "../ResponseMessages";

export class SearchPagedListStudentsActives {
    Page: number = 1;
    Status: string = "";
    StartDate?: Date;
    EndDate?: Date;
    Name: string = "";
}

export interface IPagedListStudentsActives {
    id: string;
    fullName: string;
    activatedDate: string;
    status: string;
}

export class PagedListStudentsActives extends ResponseMessages {
    Items: IPagedListStudentsActives[] = [];
    TotalItems = 0;
    PageSize = 0;
    FilteringOptionsStatus: NameAndId[] = new FilteringOptionsStatus().Items
}