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
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

export async function getNodes() {
    const db = client.db('campus_graph');
    const nodes = db.collection('nodes');

    const query = { "properties.type" : "building entrance" };
    const cursor = nodes.find(query);

    await cursor.forEach(node => console.log(node));

}