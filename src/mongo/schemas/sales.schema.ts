import mongoose, { Connection, Model } from "mongoose";

const salesSchema = new mongoose.Schema({
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
            `${process.env.DB_URL!}${companyName}${process.env.OPTIONS_DB_URL}`
        );
    }

    return connections[companyName].model<any>(
        "Sales",
        salesSchema,
        "Sales"
    );
}