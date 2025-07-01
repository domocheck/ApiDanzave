import { FilteringOptionsAssists, NameAndId } from "../../Others/Models/Others";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";

export class SearchPagedListHistoryAssistsPersons {
    Page: number = 1;
    Assist: string = ""
    PersonId: string = "";
}

export interface IPagedListHistoryAssistsPerson {
    id: string;
    date: string | Date;
    danceClasse: string;
    classId: string;
    namePerson: string;
    status: string;
}

export class PagedListHistoryAssistsPersons extends ResponseMessages {
    Items: IPagedListHistoryAssistsPerson[] = [];
    TotalItems = 0;
    PageSize = 0;
    NamePerson = "";
    FilteringOptions: NameAndId[] = new FilteringOptionsAssists().Items
}