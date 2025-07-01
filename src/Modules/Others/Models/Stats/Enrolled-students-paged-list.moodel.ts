import { months, yearsStats } from "../../Helpers/Others";
import { FilteringOptionsStatus, FilteringOptionsTuitionPaymentStatus, NameAndId, NameAndValue } from "../Others";
import { ResponseMessages } from "../ResponseMessages";

export class SearchPagedListEnrolledStudents {
    Page: number = 1;
    Year: string = "";
    Month: number = 0;
    Name: string = "";
    Status: string = "";
    Payment: string = "";
}

export interface IPagedListEnrolledStudent {
    id: string;
    status: string;
    fullName: string;
    tuitionPaymentStatus: string;
    tuitionPaymentDate: string;
    tuitionPaymentAmount: number;
    activatedDate: string;
}

export class PagedListEnrolledStudents extends ResponseMessages {
    Items: IPagedListEnrolledStudent[] = [];
    TotalItems = 0;
    PageSize = 0;
    FilteringOptionStatus: NameAndId[] = new FilteringOptionsStatus().Items
    FilteringOptionStatusPayment: NameAndId[] = new FilteringOptionsTuitionPaymentStatus().Items;
    Months: NameAndValue[] = [{ name: 'Todos', value: 0 }, ...months];
    Years: NameAndValue[] = yearsStats;
}