import express from 'express';
import cors from 'cors';
import {getAllNodes, run} from './database.js'
import { getWeatherAlerts } from "./weather.js";

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());


app.get('/status', (req, res) => {
    res.json({message: 'Server is online!'});
});

app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`);
});


app.get("/api/weather/alerts", async (req, res) => {
    const state = req.query.state || "TX";

    try {
        const data = await getWeatherAlerts(state);
        res.json(data);
        console.log(data)
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error(err.message);
    }
});

run().catch(console.dir);


app.get("/api/nodes/all", async (req, res) => {

    try {
        const nodeData = await getAllNodes();
        res.json({ nodes: nodeData })
        console.log(nodeData);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error(err.message);
    }
});
