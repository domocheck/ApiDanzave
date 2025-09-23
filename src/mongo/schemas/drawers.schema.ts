import mongoose, { Connection, Model } from "mongoose";
import { IDrawer } from "../../Modules/Drawers/Models/Drawer.models";

const drawersSchema = new mongoose.Schema({
    dateClose: String,
    dateOpen: String,
    id: String,
    status: String
});

const connections: Record<string, Connection> = {};

export function getDrawersModel(companyName: string): Model<IDrawer> {
    if (!connections[companyName]) {
        connections[companyName] = mongoose.createConnection(
            `${process.env.DB_URL!}${companyName}${process.env.OPTIONS_DB_URL}`
        );
    }

    return connections[companyName].model<IDrawer>(
        "Drawers",
        drawersSchema,
        "Drawers"
    );
}