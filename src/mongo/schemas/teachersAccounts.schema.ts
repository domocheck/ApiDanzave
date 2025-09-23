import mongoose, { mongo } from "mongoose";

const teachersAccountsSchema = new mongoose.Schema({
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

const teachersAccountsModelMongo = mongoose.model(
    "TeachersAccounts",
    teachersAccountsSchema
);
export default teachersAccountsModelMongo;