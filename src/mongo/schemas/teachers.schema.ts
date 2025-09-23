import mongoose, { Connection, Model } from "mongoose";
import { ITeachers } from "../../Modules/Teachers/Models/Teachers.models";

const teacherSchema = new mongoose.Schema({
    birthday: String,
    classes: [String],
    color: String,
    discount: Number,
    dni: String,
    email: String,
    id: String,
    instagram: String,
    isCareerStudent: Boolean,
    lastName: String,
    monthly: String,
    name: String,
    observations: String,
    phone: String,
    photo: String,
    status: String,
    updateDate: String,
    createDate: String,
});

const connections: Record<string, Connection> = {};

export function getTeachersModel(companyName: string): Model<ITeachers> {
    if (!connections[companyName]) {
        connections[companyName] = mongoose.createConnection(
            `${process.env.DB_URL!}${companyName}${process.env.OPTIONS_DB_URL}`
        );
    }

    return connections[companyName].model<ITeachers>(
        "Teachers",
        teacherSchema,
        "Teachers"
    );
}