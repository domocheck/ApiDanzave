import { months, yearsStats } from "../../Helpers/Others";
import { NameAndId, NameAndValue } from "../Others";
import { ResponseMessages } from "../ResponseMessages";

export class SearchPagedListContactsProofClass {
    Page: number = 1;
    Year: string = "";
    Month: number = 0;
    Name: string = "";
}

export interface IPagedListContactsProofClass {
    id: string;
    fullName: string;
    className: string;
    classId: string;
    date: string;
}

export class PagedListContactsProofClass extends ResponseMessages {
    Items: IPagedListContactsProofClass[] = [];
    TotalItems = 0;
    PageSize = 0;
    Months: NameAndValue[] = [{ name: 'Todos', value: 0 }, ...months];
    Years: NameAndValue[] = yearsStats;
}