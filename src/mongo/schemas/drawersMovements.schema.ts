import mongoose from "mongoose";

const drawerMovementsSchema = new mongoose.Schema({
    amount: Number,
    balance: Number,
    date: String,
    description: String,
    drawerId: String,
    id: String,
    idPerson: String,
    paymentsMethods: [{
        idPayment: String,
        paymentName: String,
        value: Number
    }],
    type: String
});

const drawerMovementsModelMongo = mongoose.model(
    "DrawerMovements",
    drawerMovementsSchema
);
export default drawerMovementsModelMongo;