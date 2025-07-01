import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS as string);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: "danzave-17295.appspot.com",
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

export { db, bucket };