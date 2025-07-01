import { FilteringOptionsStatus, NameAndId } from "../../Others/Models/Others";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";

export class SearchPagedListJuvetActivities {
    Page: number = 1;
    Name: string = '';
    Status: string = ""
}

export interface IPagedListJuvetActivity {
    id: string;
    status: string;
    activity: string;
    day: string;
    schedule: number;
    students: number;
}

export class PagedListJuvetActivities extends ResponseMessages {
    Items: IPagedListJuvetActivity[] = [];
    TotalItems = 0;
    PageSize = 0;
    FilteringOptions: NameAndId[] = new FilteringOptionsStatus().Items;
}