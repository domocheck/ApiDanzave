import { ProductChooserTable } from "../../../Boutique/Models/Products.models";
import { PaymentMethod } from "../../../Drawers/Models/Drawer.models";
import { NameAndId } from "../Others";
import { ResponseMessages } from "../ResponseMessages";

export class SearchPagedListSalesStats {
    Page: number = 1;
    Student?: string = "";
    Product?: string = "";
    StartDate?: Date;
    EndDate?: Date;
}

export interface IPagedListSalesStat {
    id: string;
    fullName: string;
    quantityProducts: number;
    date: string;
    amount: number;
    products: ProductChooserTable[]
    isCtaCte: boolean;
    paymentMethods: PaymentMethod[]
}

export class PagedListSalesStats extends ResponseMessages {
    Items: IPagedListSalesStat[] = [];
    TotalItems = 0;
    TotalPaid = 0;
    PageSize = 0;
    Students: NameAndId[] = [];
    Products: NameAndId[] = [];
}