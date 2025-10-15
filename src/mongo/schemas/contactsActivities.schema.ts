import mongoose, { Connection, Model } from "mongoose";
import { IContactsActivities } from "../../Modules/Contacts/Models/Contact.models";
import { v4 as uuidv4 } from 'uuid';

const contactsActivitiesSchema = new mongoose.Schema({
    _id: { type: String, default: () => uuidv4() },
    contactId: String,
    dateCreated: String,
    fulFillDate: String,
    id: String,
    nextContactDate: String,
    observations: String,
    result: String,
    status: String,
    updateDate: String,
    userId: String
});

const connections: Record<string, Connection> = {};

export function getContactsActivitiesModel(companyName: string): Model<IContactsActivities> {
    if (!connections[companyName]) {
        connections[companyName] = mongoose.createConnection(
            `${process.env.DB_URL!}${companyName}${process.env.OPTIONS_DB_URL}`, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
        }
        );
    }

    return connections[companyName].model<IContactsActivities>(
        "ContactsActivities",
        contactsActivitiesSchema,
        "ContactsActivities"
    );
}