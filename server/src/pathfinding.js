import UndirectedGraph from 'graphology';
import { dijkstra } from 'graphology-shortest-path';
import { getBuildingEntrances} from "./database.js";

export function calculateShortestPath(to, from, edgeData) {
    const graph = new UndirectedGraph();

    for(let i = 0; i < edgeData.length; i++) {
        graph.mergeUndirectedEdge(edgeData.at(i).from, edgeData.at(i).to, { weight: edgeData.at(i).weight });
    }

    const path = dijkstra.bidirectional(graph, to, from, 'weight');

    let totalWeight = 0;

    for (let i = 0; i < path.length - 1; i++) {
        const edge = graph.edge(path[i], path[i + 1]);
        totalWeight += graph.getEdgeAttribute(edge, 'weight');
    }

    return [path.map(Number), totalWeight];
}

export async function shortestPathBetweenBuildings(startName, endName, edges) {
    const [startingBuildingEntrances, endingBuildingEntrances] = await Promise.all([
        getBuildingEntrances(startName),
        getBuildingEntrances(endName)
    ]);

    // Build the graph
    const graph = new UndirectedGraph();
    for (const edge of edges) {
        graph.mergeUndirectedEdge(edge.from, edge.to, { weight: edge.weight });
    }

    let shortestPath;
    let shortestWeight = -1;
    for (const start of startingBuildingEntrances) {
        for (const end of endingBuildingEntrances) {
            const path = dijkstra.bidirectional(graph, start.properties.id, end.properties.id, 'weight');

            let totalWeight = 0;
            for (let i = 0; i < path.length - 1; i++) {
                const edge = graph.edge(path[i], path[i + 1]);
                totalWeight += graph.getEdgeAttribute(edge, 'weight');
            }

            if (totalWeight < shortestWeight || shortestWeight === -1) {
                shortestPath = path.map(Number);
                shortestWeight = totalWeight;
            }
        }
    }

    return [shortestPath, shortestWeight];
}
