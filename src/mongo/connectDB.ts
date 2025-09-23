import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.DB_URL!);
        console.log("connected to database");
    } catch (error) {
        console.error(error);
    }
};

export default connectDB;