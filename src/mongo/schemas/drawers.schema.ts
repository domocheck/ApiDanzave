import mongoose from "mongoose";

const drawersSchema = new mongoose.Schema({
    dateClose: String,
    dateOpen: String,
    id: String,
    status: String
});

const drawerModelMongo = mongoose.model("Drawers", drawersSchema);
export default drawerModelMongo;