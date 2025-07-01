import { FilteringOptionsStatus, NameAndId } from "../Others";
import { ResponseMessages } from "../ResponseMessages";
import { Status } from './../Others';

export class SearchPagedListAvgAssists {
    Page: number = 1;
    Student?: string[] = [];
    Teacher?: string[] = [];
    StartDate?: Date;
    EndDate?: Date;
    Status: string = "";
}

export interface IPagedListAvgAssist {
    id: string;
    status: string;
    type: string;
    fullName: string;
    reason: string;
    avgAssists: number
}

export class PagedListAvgAssists extends ResponseMessages {
    Items: IPagedListAvgAssist[] = [];
    TotalItems = 0;
    PageSize = 0;
    Students: NameAndId[] = [];
    Teachers: NameAndId[] = [];
    FilteringOptionsStatus: NameAndId[] = new FilteringOptionsStatus().Items
}