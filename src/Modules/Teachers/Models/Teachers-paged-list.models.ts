import { FilteringOptionsStatus, NameAndId } from "../../Others/Models/Others";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";

export class SearchPagedListTeachers {
    Page: number = 1;
    Name: string = '';
    Status: string = ""
}

export interface IPagedListTeacher {
    id: string;
    status: string;
    fullName: string;
    numberOfClasses: number;
}

export class PagedListTeachers extends ResponseMessages {
    Items: IPagedListTeacher[] = [];
    TotalItems = 0;
    PageSize = 0;
    FilteringOptions: NameAndId[] = new FilteringOptionsStatus().Items;
}