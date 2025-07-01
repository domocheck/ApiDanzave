import { FilteringOptionsStatus, NameAndId } from "../../Others/Models/Others";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";

export class SearchPagedListClasses {
    Page: number = 1;
    Name: string = '';
    Status: string = ""
}

export interface IPagedListClasse {
    id: string;
    status: string;
    dance: string;
    lounge: string;
    day: string;
    schedule: number;
    students: number;
}

export class PagedListClasses extends ResponseMessages {
    Items: IPagedListClasse[] = [];
    TotalItems = 0;
    PageSize = 0;
    FilteringOptions: NameAndId[] = new FilteringOptionsStatus().Items;
}

export interface ChangeStatusPerson {
    id: string;
    newStatus: string;
    reasonId: string;
    observation: string;
}