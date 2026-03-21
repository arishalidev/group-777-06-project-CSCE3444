import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Search from './routes/Search.jsx'
import Home from "./routes/Home.jsx";
import Navigation from "./routes/Navigation.jsx";

function App() {
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