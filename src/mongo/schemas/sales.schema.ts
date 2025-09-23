import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
    ctaCte: Boolean,
    id: String,
    items: [{
        categoryName: String,
        eftPrice: Number,
        id: String,
        name: String,
        quantity: Number,
        regularPrice: Number,
        stock: Number,
        variableId: String
    }]
});

const salesModelMongo = mongoose.model("Sales", salesSchema);
export default salesModelMongo;