import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getBuildings } from "./database.js";

dotenv.config();

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.get("/get/buildings", async (req, res) => {
  try {
    const buildings = await getBuildings();
    res.json({ buildings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});