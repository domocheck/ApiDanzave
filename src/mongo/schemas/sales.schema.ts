import mongoose, { Connection, Model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const salesSchema = new mongoose.Schema({
    _id: { type: String, default: () => uuidv4() },
    ctaCte: Boolean,
    id: String,
    items: [{
        categoryName: String,
        eftPrice: Number,
        id: String,
        name: String,
        quantity: Number,
        regularPrice: Number,
        stock: Number,
        variableId: String
    }]
});

const connections: Record<string, Connection> = {};

export function getSalesModel(companyName: string): Model<any> {
    if (!connections[companyName]) {
        connections[companyName] = mongoose.createConnection(
            `${process.env.DB_URL!}${companyName}${process.env.OPTIONS_DB_URL}`, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
        }
        );
    }

    return connections[companyName].model<any>(
        "Sales",
        salesSchema,
        "Sales"
    );
}