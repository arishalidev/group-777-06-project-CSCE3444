import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Search from './routes/Search.jsx'
import Home from "./components/Home.jsx";
import Navigation from "./components/Navigation.jsx";

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
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />}></Route>
                <Route path='/search' element={<Search />}></Route>
                <Route path='/navigation' element={<Navigation />}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App