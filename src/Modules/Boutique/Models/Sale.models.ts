import { PaymentMethod } from "../../Drawers/Models/Drawer.models";
import { ProductChooserTable } from "./Products.models";

export interface Sale {
    id: string;
    saleDate: string;
    items: ProductChooserTable[];
    total: number;
    paymentMethod?: PaymentMethod[];
    ctaCte: boolean;
    personId: string;
}

export interface ItemSale {
    productId: string;
    sizeId: string;
    colorId: string;
    quantity: string;
}

export interface SaleStat {
    id: string;
    date: string;
    personName: string;
    quantityItems: number;
    total: number;
    items: ProductChooserTable[];
    PaymentMethod?: PaymentMethod[];
    ctaCte: boolean;
}
