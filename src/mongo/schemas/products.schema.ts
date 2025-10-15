import mongoose, { Connection, Model } from "mongoose";
import { IProduct } from "../../Modules/Boutique/Models/Paged-list-products.models";
import { v4 as uuidv4 } from 'uuid';

const productsSchema = new mongoose.Schema({
    _id: { type: String, default: () => uuidv4() },
    categoryId: String,
    code: String,
    cost: Number,
    eftPrice: Number,
    id: String,
    name: String,
    photo: String,
    regularPrice: Number,
    rentability: Number,
    status: String,
    variables: [{
        colorId: String,
        sizeId: String,
        stock: Number,
        variableId: String
    }]
});

const connections: Record<string, Connection> = {};

export function getProductsModel(companyName: string): Model<IProduct> {
    if (!connections[companyName]) {
        connections[companyName] = mongoose.createConnection(
            `${process.env.DB_URL!}${companyName}${process.env.OPTIONS_DB_URL}`, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
        }
        );
    }

    return connections[companyName].model<IProduct>(
        "Products",
        productsSchema,
        "Products"
    );
}