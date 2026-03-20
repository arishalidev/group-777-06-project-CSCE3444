import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import {MongoClient, ServerApiVersion} from "mongodb";

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.get('/api/test', (req, res) => {
    res.json({ message: "Hello from the server!" });
});

app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`);
});

// Database Connection
const uri = process.env.DATABASE_URL

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
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

run().catch(console.dir);