import {shortestPath} from "./pathfinding.js";

const edgeData =
    [
        {
            "from": "0",
            "to": "1",
            "weight": 3
        },
        {
            "from": "1",
            "to": "2",
            "weight": 5
        },
        {
            "from": "0",
            "to": "2",
            "weight": 1
        },
    ]

test('returns the shortest path between two nodes', () => {
    const [path] = shortestPath('1', '2', edgeData);

    // Should not go directly from 1 -> 2
    expect(path).toEqual([1, 0, 2]);
})

test('returns the correct total weight for the shortest path', () => {
    const [path, weight] = shortestPath('1', '2', edgeData);

    // Shortest path is 1 -> 0 -> 2, total weight should be 3 + 1
    expect(weight).toEqual(4);
})

test('returns the shortest adjacent path', () => {
    const [path, weight] = shortestPath('0', '2', edgeData);

    expect(path).toEqual([0, 2]);
    expect(weight).toEqual(1);

})
