import { IAccount } from "../../Accounts/Models/Accounts.models";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
export class OpenDrawerResponse extends ResponseMessages {
    DrawerId: string = "";
}
export interface IDrawer {
    id: string;
    dateOpen: Date | string;
    dateClose: Date | null | string;
    status: string;
    movements: IMovement[];
}

export interface EditMovement {
    amount: number;
    balance: number;
    paymentsMethods: PaymentMethod[];
    movementId: string;
}

export interface EditMovementAndUpdateAccount {
    amount: number;
    balance: number;
    paymentsMethods: PaymentMethod[];
    movementId: string;
    account: IAccount;
    type: string;
}

export interface IMovement {
    id: string;
    amount: number;
    paymentsMethods: PaymentMethod[];
    description: string;
    date: Date | string;
    idPerson: string | null;
    type: string;
    balance?: number;
    idAccount?: string | null;
    displayNamePerson?: string;
    isCashDrawerOpen?: boolean;
}

export interface MoveByPayments {
    paymentName: string;
    paymentValue: number;
}

export interface PaymentMethod {
    value: number;
    type?: string;
    idPayment: string;
    paymentName?: string;
}

export interface IExpense {
    name: string;
}
