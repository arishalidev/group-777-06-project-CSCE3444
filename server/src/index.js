import express from 'express';
import cors from 'cors';
import {getAllEdges, getNodes, run} from './database.js'
import { getWeatherAlerts } from "./weather.js";
import {calculateShortestPath} from "./pathfinding.js";

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

        const edges = await getAllEdges();

        const [path, weight] = calculateShortestPath(6, 16 ,edges);
        const nodesInPath = await getNodes(path);


        // Gets the coordinates from the nodes to draw lines between them on the map
        let lineCoords = [];
        for (let i = 1; i < path.length; i++) {
            const lineStart = nodesInPath.find(node => node.properties.id === path[i]).geometry.coordinates;
            const lineEnd = nodesInPath.find(node => node.properties.id === path[i - 1]).geometry.coordinates;

            lineCoords.push([lineStart, lineEnd]);
        }

        res.json({nodes: nodesInPath, lines: lineCoords});



    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error(err.message);
    }
});
