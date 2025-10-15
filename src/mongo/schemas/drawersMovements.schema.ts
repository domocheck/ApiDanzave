import mongoose, { Connection, Model } from "mongoose";
import { IMovement } from "../../Modules/Drawers/Models/Drawer.models";
import { v4 as uuidv4 } from 'uuid';

const drawerMovementsSchema = new mongoose.Schema({
    _id: { type: String, default: () => uuidv4() },
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

const connections: Record<string, Connection> = {};

export function getDrawerMovementsModel(companyName: string): Model<IMovement> {
    if (!connections[companyName]) {
        connections[companyName] = mongoose.createConnection(
            `${process.env.DB_URL!}${companyName}${process.env.OPTIONS_DB_URL}`, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
        }
        );
    }

    return connections[companyName].model<IMovement>(
        "DrawerMovements",
        drawerMovementsSchema,
        "DrawerMovements"
    );
}