import mongoose, { Connection, Model, mongo } from "mongoose";
import { IStudents } from "../../Modules/Students/Models/Students.models";

const studentsSchema = new mongoose.Schema({
    actitivities: [String],
    birthday: String,
    classes: [String],
    contactMedia: String,
    createDate: String,
    discount: Number,
    dni: String,
    email: String,
    id: String,
    isCareerStudent: Boolean,
    isFit: Boolean,
    lastName: String,
    monthly: String,
    name: String,
    observations: String,
    phone: String,
    photo: String,
    reference: String,
    status: String,
    tuition: String,
    updateDate: String,
    inActiveDate: String,
    observationsInactive: String,
    proofClassDate: String,
    parent: {
        address: String,
        email: String,
        lastName: String,
        name: String,
        phone: String
    },
    school: {
        name: String,
        schedule: String
    },
});

const connections: Record<string, Connection> = {};

export function getStudentModel(companyName: string): Model<IStudents> {
    if (!connections[companyName]) {
        connections[companyName] = mongoose.createConnection(
            `${process.env.DB_URL!}${companyName}`
        );
    }

    return connections[companyName].model<IStudents>(
        "Students",
        studentsSchema,
        "Students"
    );
}