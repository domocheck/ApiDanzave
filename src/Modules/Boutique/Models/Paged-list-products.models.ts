import { FilteringOptionsStatus, NameAndId } from "../../Others/Models/Others";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { User } from "../../Others/Models/Users";
import { Variables } from "./Products.models";

export class SearchPagedListProducts {
    Page: number = 1;
    Name: string = '';
    Status: string = "";
    Category: string = "";
}

export interface IProduct {
    id: string;
    status: string;
    categoryName: string;
    price: number;
    variables: Variables[];
    rentability: number;
    code: string;
    name: string;
    totalStock: number;
}

export class PagedListProducts extends ResponseMessages {
    Items: IProduct[] = [];
    CurrentUser: User = {} as User;
    TotalItems = 0;
    PageSize = 0;
    FilteringOptionsStatus: NameAndId[] = new FilteringOptionsStatus().Items;
    FilteringOptionsCategories: NameAndId[] = [];
}