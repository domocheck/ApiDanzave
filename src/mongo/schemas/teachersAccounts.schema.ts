import mongoose, { Connection, Model, mongo } from "mongoose";
import { IAccount } from "../../Modules/Accounts/Models/Accounts.models";
import { v4 as uuidv4 } from 'uuid';

const teachersAccountsSchema = new mongoose.Schema({
    _id: { type: String, default: () => uuidv4() },
    amount: Number,
    balance: Number,
    description: String,
    discounts: Number,
    eftAmount: String,
    eftBalance: String,
    id: String,
    idPerson: String,
    increase: Number,
    isPaidWhitEft: Boolean,
    month: Number,
    paymentsMethods: [{
        idPayment: String,
        value: Number
    }],
    settleDate: String,
    status: String,
    year: Number
});

const connections: Record<string, Connection> = {};

export function getTeachersAccountsModel(companyName: string): Model<IAccount> {
    if (!connections[companyName]) {
        connections[companyName] = mongoose.createConnection(
            `${process.env.DB_URL!}${companyName}${process.env.OPTIONS_DB_URL}`, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
        }
        );
    }

    return connections[companyName].model<IAccount>(
        "TeachersAccounts",
        teachersAccountsSchema,
        "TeachersAccounts"
    );
}