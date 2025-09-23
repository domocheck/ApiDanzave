import mongoose, { Connection, Model } from "mongoose";
import { IProduct } from "../../Modules/Boutique/Models/Paged-list-products.models";

const productsSchema = new mongoose.Schema({
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
            `${process.env.DB_URL!}${companyName}${process.env.OPTIONS_DB_URL}`
        );
    }

    return connections[companyName].model<IProduct>(
        "Products",
        productsSchema,
        "Products"
    );
}