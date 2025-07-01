import { IPayments } from "../../Config/Models/Config.models";
import { IDrawer, IMovement, PaymentMethod } from "../../Drawers/Models/Drawer.models";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { IStudents } from "../../Students/Models/Students.models";
import { ITeachers } from "../../Teachers/Models/Teachers.models";

export class Account extends ResponseMessages {
    Items: IAccount[] = [];
    TotalItems = 0;
}

export class StatusAccountStudent extends ResponseMessages {
    Student: IStudents = {} as IStudents;
    Accounts: IAccount[] = [];
}

export class StatusAccountTeacher extends ResponseMessages {
    Teacher: ITeachers = {} as ITeachers;
    Accounts: IAccount[] = [];
}

export class StatusAccountInd<T> extends ResponseMessages {
    Account: IAccount = {} as IAccount;
    Momvements: IMovement[] = [];
    PaymentMethodsConfig: IPayments[] = [];
    Person: T = {} as T;
    TypePerson: string = '';
}

export class SettleFormInfo extends ResponseMessages {
    paymentsMethods: IPayments[] = [];
    drawerOpen: IDrawer = {} as IDrawer;
}

export class SettleAccountResponse extends ResponseMessages {
    Items: SettleAccountInd[] = [];
}

export interface GenerateAccount {
    personId: string;
    type: string;
    amount: number;
    eftAmount: number;
    description?: string;
}
export interface SettleAccountInd {
    date: string;
    description: string;
    namePerson: string;
    balance: number;
    totalPaid: number;
    payments: PaymentMethod[];
}

export interface SettleAccount {
    account: IAccount;
    paymentsMethods: PaymentMethod[];
    total: number;
    type: string;
}

export interface EditAccount {
    accountId: string;
    amount: number;
    eftAmount: number;
    type: string;
}

export interface IAccount {
    id: string;
    idPerson: string;
    month: number;
    year: number;
    amount: number;
    paymentsMethods: PaymentMethod[];
    status: string;
    settleDate: Date | null | string;
    description?: string;
    balance: number;
    eftBalance: number;
    eftAmount: number;
    observations?: string;
    discounts?: number;
    increase?: number;
    isPaidWhitEft?: boolean;
    displayName?: string;
}

export class Accounts {
    name!: string;
    debt!: number;
    credit!: number;
    balance!: number;
    status!: string;
    month?: number;
    year?: number;
}

export class AccountWhitDebt {
    name!: string;
    lastName!: string;
    idPerson!: string;
    displayName!: string;
    accounts: IAccount[] = [];
}
