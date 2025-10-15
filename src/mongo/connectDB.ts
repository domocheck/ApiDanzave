// src/mongo/connectDB.ts
import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    const uri = process.env.DB_URL;

    if (!uri) {
        console.error("❌ No se encontró la variable de entorno DB_URL");
        process.exit(1); // detiene el servidor si falta
    }

    try {
        mongoose.set("strictQuery", true);

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 15000, // espera más antes de dar timeout
            socketTimeoutMS: 45000,          // mantiene el socket más tiempo abierto
            autoIndex: true,                 // crea índices automáticamente
            connectTimeoutMS: 15000,         // timeout de conexión inicial
        });

        console.log("✅ Conectado correctamente a MongoDB");
    } catch (error: any) {
        console.error("❌ Error conectando a MongoDB:", error.message);
        process.exit(1); // termina la app si no puede conectar
    }

    // Eventos útiles para monitorear la conexión
    mongoose.connection.on("disconnected", () => {
        console.warn("⚠️  Conexión con MongoDB perdida");
    });

    mongoose.connection.on("reconnected", () => {
        console.log("🔁 Reconectado a MongoDB");
    });

    mongoose.connection.on("error", (err) => {
        console.error("❌ Error en la conexión de MongoDB:", err);
    });
};

export default connectDB;
