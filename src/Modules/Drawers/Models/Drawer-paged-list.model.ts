import { IPayments } from "../../Config/Models/Config.models";
import { NameAndId } from "../../Others/Models/Others";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { IMovement } from "./Drawer.models";

export class SearchPagedListDrawers {
    Page: number = 1;
    Name: string = '';
    Type: string = "";
    DrawerId: string = "";
}

export interface IPagedListMovements {
    id: string;
    status: string;
    description: string;
    fullName: string;
    date: string;
    amount: number;
}

export class PagedListDrawers extends ResponseMessages {
    Items: IPagedListMovements[] = [];
    Drawer: IPagedListDrawer = {} as IPagedListDrawer;
    PaymentsMethods: IPayments[] = []
    TotalItems = 0;
    PageSize = 0;
    FilteringOptions: NameAndId[] = [
        { id: 'all', name: 'Todos' },
        { id: 'ingresses', name: 'Ingresos' },
        { id: 'egresses', name: 'Egresos' },
    ];
}

export class IPagedListDrawer {
    DrawerId?: string = ""
    DrawerStatus: string = "";
    DrawerOpenDate?: string;
    DrawerCloseDate?: string;
    DrawerMovements?: IMovement[]
}