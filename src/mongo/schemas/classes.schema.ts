import mongoose from "mongoose";

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

const classesModelMongo = mongoose.model('Classes', classesSchema);
export default classesModelMongo