import mongoose from "mongoose";

const assistsSchema = new mongoose.Schema({
    absent: [String],
    date: String,
    disease: [String],
    id: String,
    idClass: String,
    idTeacher: String,
    missing: String,
    presents: String,
    proofClass: String
})

const assistModelMongo = mongoose.model('Assists', assistsSchema);
export default assistModelMongo