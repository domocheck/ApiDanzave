import { FilteringOptionsActivitiesActivity, FilteringOptionsActivitiesInterest, FilteringOptionsActivitiesStatus, NameAndId } from "../../Others/Models/Others";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";

export class SearchContactsActivities {
    Page: number = 1;
    Name: string = '';
    Status: string = "";
    Activity: string = "";
    Interest: string = "";
    Reference: string = "";
    User: string = "";
}

export interface IPagedListContactActivitiy {
    id: string;
    status: string;
    fullName: string;
    phone: string | number;
    interest?: string;
    activity: string;
    reference?: string;
    nextContactDate: string;
    user: string;
    contactId: string
}

export class PagedListContactsActivities extends ResponseMessages {
    Items: IPagedListContactActivitiy[] = [];
    TotalItems = 0;
    PageSize = 0;
    StatusFilter: NameAndId[] = new FilteringOptionsActivitiesStatus().Items
    ActivityFilter: NameAndId[] = new FilteringOptionsActivitiesActivity().Items
    InterestFilter: NameAndId[] = new FilteringOptionsActivitiesInterest().Items
    ReferenceFilter: NameAndId[] = [];
    UserFilter: NameAndId[] = [];
}