import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    categoryId: String,
    code: String,
    cost: Number,
    eftPrice: Number,
    id: String,
    name: String,
    photo: String,
    regularPrice: Number,
    rentability: Number,
    status: String,
    variables: [{
        colorId: String,
        sizeId: String,
        stock: Number,
        variableId: String
    }]
});

const productsModelMongo = mongoose.model("Products", productsSchema);
export default productsModelMongo;