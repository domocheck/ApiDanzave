import { NameAndId } from "../Others";
import { ResponseMessages } from "../ResponseMessages";

export class SearchPagedListStudentsInactives {
    Page: number = 1;
    Reason?: string = "";
    StartDate?: Date;
    EndDate?: Date;
    Name: string = "";
}

export interface IPagedListStudentsInactives {
    id: string;
    fullName: string;
    inactivatedDate: string;
    reason: string;
}

export class PagedListStudentsInactives extends ResponseMessages {
    Items: IPagedListStudentsInactives[] = [];
    TotalItems = 0;
    PageSize = 0;
    Reasons: NameAndId[] = [];
}