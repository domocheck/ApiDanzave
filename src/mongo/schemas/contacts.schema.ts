import mongoose, { Connection, Model } from "mongoose";
import { IContacts } from "../../Modules/Contacts/Models/Contact.models";

const contactsSchema = new mongoose.Schema({
    classes: [String],
    contactMedia: String,
    createDate: String,
    displayName: String,
    id: String,
    interest: String,
    lastName: String,
    name: String,
    observations: String,
    phone: String,
    proofClassDate: String,
    reference: String,
    status: String,
    toStudentDate: String,
    updateDate: String,
});

const connections: Record<string, Connection> = {};

export function getContactsModel(companyName: string): Model<IContacts> {
    if (!connections[companyName]) {
        connections[companyName] = mongoose.createConnection(
            `${process.env.DB_URL!}${companyName}${process.env.OPTIONS_DB_URL}`
        );
    }

    return connections[companyName].model<IContacts>(
        "Contacts",
        contactsSchema,
        "Contacts"
    );
}