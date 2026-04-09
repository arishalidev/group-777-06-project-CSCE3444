import Navbar from "../components/Navbar.jsx";
import MyMap from "../components/Map.jsx";
import {useState} from "react";

function Navigation() {

    const [startLocation, setStartLocation] = useState("");
    const [endLocation, setEndLocation] = useState("");
    const [showMap, setShowMap] = useState(false);
    const [mapKey, setMapKey] = useState(0);

    function renderMap() {
        setShowMap(true);
        setMapKey(k => k + 1);
    }

    return (
        <div>
            <Navbar></Navbar>
            <div className={'py-24'}>
                <h1 className={'text-6xl text-center'}>Navigation Page</h1>
            </div>

            <div className={'flex justify-center m-12'}>
                <div className={'mx-6'}>
                    <h3 className={'text-xl'}>Start Location:</h3>
                    <input
                        type={"text"}
                        value={startLocation}
                        onChange={(e) => setStartLocation(e.target.value)}
                        placeholder={"Enter Start Location"}
                        className={'border-2 rounded-md p-4'}
                    />
                </div>

                <div className={'mx-6'}>
                    <h3 className={'text-xl'}>End Location:</h3>
                    <input
                        type={"text"}
                        value={endLocation}
                        onChange={(e) => setEndLocation(e.target.value)}
                        placeholder={"Enter End Location"}
                        className={'border-2 rounded-md p-4'}
                    />
                </div>

                <div className={'mx-6'}>
                    <h3 className={'text-xl invisible'}>End Location:</h3>
                    <button
                        className={'bg-green-500 rounded p-4 hover:bg-green-600 border-2'}
                        onClick={renderMap}
                    >Start Navigation</button>
                </div>

            </div>

            {showMap && (
                <div className={'flex justify-center'}>
                    <MyMap key={mapKey} startName={startLocation} endName={endLocation} />
                </div>
            )}
        </div>
    )

}

export default Navigation