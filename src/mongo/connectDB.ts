// src/mongo/connectDB.ts
import mongoose, { Connection } from "mongoose";

let connection: Connection | null = null; // variable singleton
let isConnected = false;

const connectDB = async (): Promise<Connection> => {
    if (isConnected) {
        console.log("✅ Usando conexión a MongoDB ya existente");
        return mongoose.connection;;
    }

    const uri = process.env.DB_URL;
    console.log(uri)
    if (!uri) {
        console.error("❌ No se encontró la variable de entorno DB_URL");
        process.exit(1);
    }

    try {
        mongoose.set("strictQuery", true);

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
            autoIndex: true,
            connectTimeoutMS: 15000,
        });

        connection = mongoose.connection; // guardamos la conexión
        console.log("✅ Conectado correctamente a MongoDB");

        // Eventos útiles para monitorear la conexión
        connection.on("disconnected", () => {
            console.warn("⚠️  Conexión con MongoDB perdida");
        });
        connection.on("reconnected", () => {
            console.log("🔁 Reconectado a MongoDB");
        });
        connection.on("error", (err) => {
            console.error("❌ Error en la conexión de MongoDB:", err);
        });

        isConnected = true;
        return connection;
    } catch (error: any) {
        console.error("❌ Error conectando a MongoDB:", error.message);
        process.exit(1);
    }
};


export default connectDB;
