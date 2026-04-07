import 'dotenv/config'
import {MongoClient, ServerApiVersion} from "mongodb";

// Database Connection
const uri = process.env.DATABASE_URL

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function run() {
    try {
        // Connect the client to the server
        await client.connect();

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Successfully connected to MongoDB!");
    } catch (err) {
        // Ensures that the client will close when you finish/error
        console.error(`Mongodb connection failed: ${err}`);
    }
}

export async function getNodes(id = []) {
    const db = client.db('campus_graph');
    const nodes = db.collection('nodes');

    const query = {'properties.id':{$in:id}};
    return await nodes.find(query).toArray();
}

export async function getAllEdges() {
    const db = client.db('campus_graph');
    const nodes = db.collection('edges');
    return await nodes.find({}).toArray();
}

export async function getBuildingEntrances(buildingName) {

    if (typeof buildingName !== 'string') {
        throw new TypeError('Expected "buildingName" to be a string');
    }

    const db = client.db('campus_graph');
    const nodes = db.collection('nodes');

    return await nodes.find({type:'Feature','properties.type':'building entrance', 'properties.name': buildingName}).toArray();
}

export async function getBuildingCoordinates(buildingAbbreviation) {
    if (typeof buildingAbbreviation != 'string') {
        throw new TypeError('Expected "buildingAbbreviation" to be a string');
    }

    const db = client.db('buildings');
    const buildings = db.collection('unt_main');

    return await buildings.find({abbreviation: buildingAbbreviation}).toArray();
}
