import UndirectedGraph from 'graphology';
import { dijkstra } from 'graphology-shortest-path';

export function calculateShortestPath(to, from, edgeData) {
    const graph = new UndirectedGraph();

    // Add edges to graph
    for(let i = 0; i < edgeData.length; i++) {
        graph.mergeUndirectedEdge(edgeData.at(i).from, edgeData.at(i).to, { weight: edgeData.at(i).weight });
    }

    // Calculate shortest path using dijkstra.bidirectional
    const path = dijkstra.bidirectional(graph, to, from, 'weight');
    let totalWeight = 0;

    // Add weights of shortest path together
    for (let i = 0; i < path.length - 1; i++) {
        const edge = graph.edge(path[i], path[i + 1]);
        totalWeight += graph.getEdgeAttribute(edge, 'weight');
    }

    return [path.map(Number), totalWeight];
}
