import mongoose from "mongoose";

const contactsActivitiesSchema = new mongoose.Schema({
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

const contactsActivitiesModelMongo = mongoose.model(
    "ContactsActivities",
    contactsActivitiesSchema
);
export default contactsActivitiesModelMongo;