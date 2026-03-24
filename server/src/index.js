import express from 'express';
import cors from 'cors';
import {run} from './database.js'

const app = express();
const PORT = 5001;
const express = require("express");
const { getWeatherAlerts } = require("./weatherAlerts");

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
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
run().catch(console.dir);
