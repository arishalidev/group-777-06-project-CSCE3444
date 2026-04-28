import express from 'express';
import cors from 'cors';
import {
    addFeedbackReport,
    findClosestNode,
    getAllEdges,
    getBuildingCoordinates, getBuildings,
    getNodes,
    run
} from './database.js'
import { getWeatherAlerts } from "./weather.js";
import {calculateShortestPath } from "./pathfinding.js";

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


app.get("/api/nodes", async (req, res) => {
    try {
        const edges = await getAllEdges();

        const startBuildingCoords = await getBuildingCoordinates(req.query.start);
        const endBuildingCoords = await getBuildingCoordinates(req.query.end);

        const startNode = await findClosestNode(startBuildingCoords.longitude, startBuildingCoords.latitude);
        const endNode = await findClosestNode(endBuildingCoords.longitude, endBuildingCoords.latitude);

        const [path, totalWeight] = await calculateShortestPath(startNode.properties.id, endNode.properties.id, edges);
        const nodesInPath = await getNodes(path);

        let lineCoords = [];
        for (let i = 1; i < path.length; i++) {
            const lineStart = nodesInPath.find(node => node.properties.id === path[i]);
            const lineEnd = nodesInPath.find(node => node.properties.id === path[i - 1]);

            
            if(lineStart === undefined || lineEnd === undefined) {
                console.error(`Could not find node ${path[i]} or node ${path[i-1]} in database!`);
                continue;
            }

            lineCoords.push([lineStart.geometry.coordinates, lineEnd.geometry.coordinates]);
        }

        res.json({nodes: nodesInPath, lines: lineCoords, totalWeight});

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error(err.message);
    }
});

app.get('/get/buildings', async (req, res) => {
    try {
        const buildings = await getBuildings();
        res.json({buildings: buildings});

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error(err.message);
    }
});

app.get('/set/feedback', async (req, res) => {
    try {
        await addFeedbackReport(req.query.name, req.query.description, req.query.severity);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error(err.message);
    }
});
