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
    const startingBuildingEntrances = await getBuildingEntrances(startName);
    const endingBuildingEntrances = await getBuildingEntrances(endName);

    let shortestPath;
    let shortestWeight = -1;
    for(const startingBuildingEntrance of startingBuildingEntrances) {
        for(const endingBuildingEntrance of endingBuildingEntrances) {
            const [path, weight] = calculateShortestPath(startingBuildingEntrance.properties.id, endingBuildingEntrance.properties.id, edges);

            if(weight < shortestWeight || shortestWeight === -1) {
                shortestPath = path;
                shortestWeight = weight;
            }
        }
    }

    return [shortestPath, shortestWeight];

}
