import mongoose, { Connection, Model } from "mongoose";
import { IClasses } from "../../Modules/Classes/Models/classes.models";
import { v4 as uuidv4 } from 'uuid';

const classesSchema = new mongoose.Schema({
    _id: { type: String, default: () => uuidv4() },
    color: String,
    CreatedDate: String,
    dance: String,
    date: String,
    days: [Number],
    duration: Number,
    id: String,
    idTeacher: String,
    isRepeat: Boolean,
    lounge: String,
    otherPlaces: String,
    schedule: Number,
    status: String,
    students: [String]
});

const connections: Record<string, Connection> = {};

export function getClassesModel(companyName: string): Model<IClasses> {
    if (!connections[companyName]) {
        connections[companyName] = mongoose.createConnection(
            `${process.env.DB_URL!}${companyName}${process.env.OPTIONS_DB_URL}`, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
        }
        );
    }

    return connections[companyName].model<IClasses>(
        "Classes",
        classesSchema,
        "Classes"
    );
}