import mongoose, { Connection, Model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema({
    _id: { type: String, default: () => uuidv4() },
    id: String,
    name: String,
    email: String,
    role: String,
    password: String,
    status: String,
    idPerson: String,
});

const userModel = mongoose.model("Users", userSchema);

export default userModel;