import { getNodes, getBuildingEntrances, getBuildingCoordinates, findClosestNode, addFeedbackReport } from "./database.js"

test('getBuildingEntrances throws TypeError when passed a non-string', async () => {
    await expect(getBuildingEntrances(123)).rejects.toThrow(TypeError);
});

test('getBuildingCoordinates throws TypeError when passed a non-string', async () => {
    await expect(getBuildingCoordinates(123)).rejects.toThrow(TypeError);
});

test('findClosestNode throws TypeError when passed non-numbers', async () => {
    await expect(findClosestNode("a", "b")).rejects.toThrow(TypeError);
});

test('addFeedbackReport throws TypeError when passed non-strings', async () => {
    await expect(addFeedbackReport(1, 2, 3)).rejects.toThrow(TypeError);
});

test('throws Error when passed an empty array', async () => {
    await expect(getNodes([])).rejects.toThrow(Error);
})