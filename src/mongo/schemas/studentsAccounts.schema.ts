import mongoose, { mongo } from "mongoose";

const studentsAccountsSchema = new mongoose.Schema({
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

const studentsAccountsModelMongo = mongoose.model(
    "StudentsAccounts",
    studentsAccountsSchema
);
export default studentsAccountsModelMongo;