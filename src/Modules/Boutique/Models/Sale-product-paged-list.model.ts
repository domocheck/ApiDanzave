import { IPayments } from "../../Config/Models/Config.models";
import { NameAndId } from "../../Others/Models/Others";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { StudentsActives } from "../../Students/Models/Students.models";
import { ProductChooserTable } from "./Products.models";

export class SearchPagedListProductChooser {
    Page: number = 1;
    Name: string = '';
    Category: string = "";
}

export class PagedListProductChooser extends ResponseMessages {
    Items: ProductChooserTable[] = [];
    TotalItems = 0;
    PageSize = 0;
    FilteringOptionsCategories: NameAndId[] = [];
    PaymentsMethods: IPayments[] = [];
    StudentsActives: StudentsActives[] = []
}