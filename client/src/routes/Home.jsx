import Navbar from "../components/Navbar.jsx";
import {useEffect, useState} from "react";

function Home() {

    const [data, setData] = useState("Loading...");

    useEffect(() => {
        fetch('http://localhost:5001/status')
            .then(res => res.json())
            .then(json => setData(json.message))
            .catch(err =>  {
                setData("Could not connect to server ❌");
                console.error(err);
            });
    }, []);

    return (
        <div>
            <Navbar></Navbar>
            <div className={'py-24'}>
                <h1 className={'text-6xl text-center pb-12'}>Home</h1>
                <p className={'text-2xl text-center'}>Welcome to NavSense, routing made easy</p>
            </div>
        </div>
    )
}

export default Home