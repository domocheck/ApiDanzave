import mongoose, { Connection, Model } from "mongoose";
import { IActivity } from "../../Modules/Activities/Models/Activities.models";
import { v4 as uuidv4 } from 'uuid';

const activitiesSchema = new mongoose.Schema({
    _id: { type: String, default: () => uuidv4() },
    activity: String,
    createdDate: String,
    date: String,
    days: [Number],
    duration: Number,
    guest: String,
    id: String,
    idTeacher: String,
    isRepeat: Boolean,
    lounge: String,
    otherPlaces: String,
    schedule: Number,
    status: String,
    students: [String],
})

const connections: Record<string, Connection> = {};

export function getActivitiesModel(companyName: string): Model<IActivity> {
    if (!connections[companyName]) {
        connections[companyName] = mongoose.createConnection(
            `${process.env.DB_URL!}${companyName}${process.env.OPTIONS_DB_URL}`, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
        }
        );
    }

    return connections[companyName].model<IActivity>(
        "Activities",
        activitiesSchema,
        "Activities"
    );
}