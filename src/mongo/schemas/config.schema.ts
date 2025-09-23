import mongoose, { Connection, Model } from "mongoose";
import { IConfig } from "../../Modules/Config/Models/Config.models";

const configSchema = new mongoose.Schema({
    categoriesProducts: [{
        id: String,
        name: String
    }],
    colorsProducts: [{
        id: String,
        name: String
    }],
    contactMedia: [{
        id: String,
        name: String
    }],
    expirationDays: [{
        id: String,
        name: String
    }],
    hours: [{
        day: String,
        initialHour: Number,
        finalHour: Number
    }],
    paymentsMethods: [{
        id: String,
        name: String,
        type: String
    }],
    quantityPagesToSee: Number,
    ranges: {
        bajo: Number,
        intermedio: Number,
        medio: Number
    },
    reasons: [{
        id: String,
        name: String
    }],
    references: [{
        id: String,
        name: String
    }],
    roles: [String],
    sizesProducts: [{
        id: String,
        name: String
    }],
    studentsHourlyPrice: Number,
    studentsPrice: [{
        eftPrice: Number,
        id: String,
        name: String,
        regularPrice: Number,
        status: String
    }],
    teachersHourlyPrice: Number,
    teachersPrice: [{
        eftPrice: Number,
        id: String,
        name: String,
        regularPrice: Number,
        status: String
    }],
});

const connections: Record<string, Connection> = {};

export function getConfigModel(companyName: string): Model<IConfig> {
    if (!connections[companyName]) {
        connections[companyName] = mongoose.createConnection(
            `${process.env.DB_URL!}${companyName}${process.env.OPTIONS_DB_URL}`
        );
    }

    return connections[companyName].model<IConfig>(
        "Config",
        configSchema,
        "Config"
    );
}