import mongoose from "mongoose";

const activitiesSchema = new mongoose.Schema({
    activity: String,
    createdDate: String,
    date: String,
    days: [Number],
    duration: Number,
    guest: String,
    id: String,
    idTeacher: String,
    isRepeat: Boolean,
    lounge: String,
    otherPlaces: String,
    schedule: Number,
    status: String,
    students: [String],
})

const activitiyModelMongo = mongoose.model('Activities', activitiesSchema);
export default activitiyModelMongo