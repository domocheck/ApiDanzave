import { Reference } from "../../Config/Models/Config.models";
import { FilteringOptionsStatus, NameAndId } from "../../Others/Models/Others";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";

export class SearchPagedListContacts {
    Page: number = 1;
    Name: string = '';
    Status: string = ""
}

export class ConfigContactsPagedList extends ResponseMessages {
    References: Reference[] = [];
    ContactsMedia: Reference[] = [];
}

export interface IPagedListContact {
    id: string;
    status: string;
    fullName: string;
    phone?: number;
    reference?: string;
    contactMedia: string;
    firstContactDate: string;
}

export class PagedListContacts extends ResponseMessages {
    Items: IPagedListContact[] = [];
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