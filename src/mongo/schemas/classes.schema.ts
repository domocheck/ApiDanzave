import mongoose, { Connection, Model } from "mongoose";
import { IClasses } from "../../Modules/Classes/Models/classes.models";

const classesSchema = new mongoose.Schema({
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
            `${process.env.DB_URL!}${companyName}${process.env.OPTIONS_DB_URL}`
        );
    }

    return connections[companyName].model<IClasses>(
        "Classes",
        classesSchema,
        "Classes"
    );
}