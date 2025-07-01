import { NameAndId } from "../../Others/Models/Others";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";

export class SearchPagedListHistoryDrawers {
    Page: number = 1;
    Status: string = "";
    StartDate?: Date
    EndDate?: Date
}

export interface IPagedListHistoryDrawer {
    id: string;
    status: string;
    openDate: string;
    closeDate: string;
    totalIncome: number;
    totalOutcome: number;
    total: number;
}

export class PagedListHistoryDrawers extends ResponseMessages {
    Items: IPagedListHistoryDrawer[] = [];
    TotalItems = 0;
    PageSize = 0;
    FilteringOptions: NameAndId[];

    constructor() {
        super();
        this.FilteringOptions = [
            {
                id: 'all',
                name: 'Todos'
            },
            {
                id: 'open',
                name: 'Abierta'
            },
            {
                id: 'closed',
                name: 'Cerrada'
            }
        ]
    }
}