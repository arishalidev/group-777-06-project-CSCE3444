import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("❌ MONGO_URI is missing");
}

// ✅ DO NOT SHARE CLIENT
export async function getBuildings() {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db("buildings");
    const collection = db.collection("unt_main");

    const data = await collection.find({}).toArray();

    return data;

  } catch (err) {
    console.error("❌ DB ERROR:", err);
    throw err;
  }
}