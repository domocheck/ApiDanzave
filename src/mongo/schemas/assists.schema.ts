import mongoose, { Connection, Model } from "mongoose";
import { IAssists } from "../../Modules/Assists/Models/Assists.models";
import { v4 as uuidv4 } from 'uuid';

const assistsSchema = new mongoose.Schema({
    _id: { type: String, default: () => uuidv4() },
    absent: [String],
    date: String,
    disease: [String],
    id: String,
    idClass: String,
    idTeacher: String,
    missing: [String],
    presents: [String],
    proofClass: [String]
})

const connections: Record<string, Connection> = {};

export function getAssistsModel(companyName: string): Model<IAssists> {
    if (!connections[companyName]) {
        connections[companyName] = mongoose.createConnection(
            `${process.env.DB_URL!}${companyName}${process.env.OPTIONS_DB_URL}`, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
        }
        );
    }

    return connections[companyName].model<IAssists>(
        "Assists",
        assistsSchema,
        "Assists"
    );
}