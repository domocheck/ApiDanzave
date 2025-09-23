import mongoose from "mongoose";

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

const contactsModelMongo = mongoose.model("Contacts", contactsSchema);
export default contactsModelMongo;