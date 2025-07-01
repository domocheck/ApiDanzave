import { ItemsConfig } from "../../Config/Models/Config.models";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";

export class ProductsResponse extends ResponseMessages {
    Items: Product[] = [];
    TotalItems = 0;
}

export class OptionsFormProduct extends ResponseMessages {
    Categories: ItemsConfig[] = [];
    Sizes: ItemsConfig[] = [];
    Colors: ItemsConfig[] = [];
}

export interface Product {
    id: string;
    name: string;
    code?: string | null;
    categoryId: string;
    caregoryName?: string;
    variables: Variables[];
    photo?: string;
    cost?: number;
    rentability?: number;
    regularPrice: number;
    eftPrice: number;
    createdDate?: string;
    updatedDate?: string;
    status: string;
}

export interface ProductTable {
    id: string;
    name: string;
    code?: string | null;
    categoryName?: string;
    regularPrice: number;
    status: string;
    totalStock: number;
    rentability: number;
}

export interface Variables {
    sizeId?: string;
    sizeName?: string;
    colorId?: string;
    colorName?: string;
    stock?: number;
    type?: string;
    variableId: string;
}

export interface ProductStockTable {
    id: string;
    productWhitVariablesId: string;
    name: string;
    size: string;
    sizeId: string;
    colorId: string;
    categoryName?: string;
    color: string;
    stock: number;
}

export interface ProductChooserTable {
    id: string;
    name: string;
    quantity: number;
    regularPrice: number;
    eftPrice: number;
    stock: number;
    categoryName: string;
    variableId: string;
}
