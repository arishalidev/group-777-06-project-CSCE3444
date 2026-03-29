import UndirectedGraph from 'graphology';
import dijkstra from 'graphology-shortest-path';

export function calculateRoute(edgeData) {
    const graph = new UndirectedGraph();


    for(let i = 0; i < edgeData.length; i++) {
        graph.mergeUndirectedEdge(edgeData.at(i).from, edgeData.at(i).to, { weight: edgeData.at(i).weight });
    }

    const path = dijkstra.bidirectional(graph, 5, 11, 'weight');

    let totalWeight = 0;

    for (let i = 0; i < path.length - 1; i++) {
        const edge = graph.edge(path[i], path[i + 1]);
        totalWeight += graph.getEdgeAttribute(edge, 'weight');
    }

    console.log("Path:", path);
    console.log("Total weight:", totalWeight);
}
