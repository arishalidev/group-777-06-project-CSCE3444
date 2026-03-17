import { useEffect, useState } from 'react'

function App() {
    const [data, setData] = useState("Loading...");

    useEffect(() => {
        // Fetching from your local Node server
        fetch('http://localhost:5001/api/test')
            .then(res => res.json())
            .then(json => setData(json.message))
            .catch(err => setData("Could not connect to server ❌"));
    }, []);

    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
            <h1>Campus Nav Project</h1>
            <p>Server Status: <strong>{data}</strong></p>
        </div>
    )
}

export default App