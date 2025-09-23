import mongoose from "mongoose";

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

const teachersModelMongo = mongoose.model("Teachers", teacherSchema);
export default teachersModelMongo;