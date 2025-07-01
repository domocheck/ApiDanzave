import { AccountWhitDebt } from "../../Accounts/Models/Accounts.models";
import { IPayments } from "../../Config/Models/Config.models";
import { NameAndId } from "../../Others/Models/Others";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { IPagedListDrawer } from "./Drawer-paged-list.model";
import { IExpense } from "./Drawer.models";

export class ExpenseForm extends ResponseMessages {
    ExpensesTypes: IExpense[] = [];
    PaymentsMethods: IPayments[] = [];
}

export class ReceiptForm extends ResponseMessages {
    PaymentsMethods: IPayments[] = [];
    PersonsWhitDebit: AccountWhitDebt[] = [];
}

export class ManualMoveForm extends ResponseMessages {
    PaymentsMethods: IPayments[] = [];
    MoveType: NameAndId[];

    constructor() {
        super();
        this.MoveType = [
            {
                id: 'ingress',
                name: 'Ingreso'
            },
            {
                id: 'egress',
                name: 'Egreso'
            }
        ]
    }
}

export class CloseDrawerForm extends ResponseMessages {
    Drawer: IPagedListDrawer[] = [];
    PaymentsMethods: IPayments[] = [];
}