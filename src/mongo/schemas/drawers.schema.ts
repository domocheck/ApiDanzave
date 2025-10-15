import mongoose, { Connection, Model } from "mongoose";
import { IDrawer } from "../../Modules/Drawers/Models/Drawer.models";
import { v4 as uuidv4 } from 'uuid';


const drawersSchema = new mongoose.Schema({
    _id: { type: String, default: () => uuidv4() },
    dateClose: String,
    dateOpen: String,
    id: String,
    status: String
});

const connections: Record<string, Connection> = {};

export function getDrawersModel(companyName: string): Model<IDrawer> {
    if (!connections[companyName]) {
        connections[companyName] = mongoose.createConnection(
            `${process.env.DB_URL!}${companyName}${process.env.OPTIONS_DB_URL}`, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
        }
        );
    }

    return connections[companyName].model<IDrawer>(
        "Drawers",
        drawersSchema,
        "Drawers"
    );
}