import Navbar from "../components/Navbar.jsx";
import MyMap from "../components/Map.jsx";
import WeatherAlertComponent from "../components/WeatherAlertComponent.jsx";
import {useEffect, useState} from "react";

function Navigation() {

    const [startLocation, setStartLocation] = useState("");
    const [endLocation, setEndLocation] = useState("");
    const [showMap, setShowMap] = useState(false);
    const [mapKey, setMapKey] = useState(0);
    const [showAlerts, setShowAlerts] = useState(false);

    function renderMap() {
        setShowMap(true);
        setMapKey(k => k + 1);
    }

    const [buildings, setBuildings] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5001/get/buildings')
            .then(res => res.json())
            .then(json => {
                console.log(json)
                setBuildings(json.buildings);
            })
    }, []);


    /*
    const params = new URLSearchParams({
        name: "hi",
        severity: "HIGH",
        description: "yes"
    });

    useEffect(() => {
        fetch(`http://localhost:5001/set/feedback?${params.toString()}`)
            .catch(err => {
                console.error(err);
            });
    }, []);
*/

    return (
        <div>
            <Navbar />
            <div className={'py-24'}>
                <h1 className={'text-6xl text-center'}>Navigation Page</h1>
            </div>

            <div className={'flex justify-center m-12'}>
                <div className={'mx-6'}>
                    <h3 className={'text-xl'}>Start Location:</h3>
                    <select className={'border-2 rounded-md p-4 appearance-none'}
                            value={startLocation} onChange={(e) => setStartLocation(e.target.value)}>
                        <option value="" disabled>Select a building</option>
                        {buildings.map((building) => (
                            <option key={building.abbreviation} value={building.abbreviation}>
                                {building.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={'mx-6'}>
                    <h3 className={'text-xl'}>End Location:</h3>
                    <select className={'border-2 rounded-md p-4'}
                            value={endLocation} onChange={(e) => setEndLocation(e.target.value)}>
                        <option value="" disabled>Select a building</option>
                        {buildings.map((building) => (
                            <option key={building.abbreviation} value={building.abbreviation}>
                                {building.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={'mx-6'}>
                    <h3 className={'text-xl invisible'}>End Location:</h3>
                    <button
                        className={'bg-green-500 rounded p-4 hover:bg-green-600 border-2'}
                        onClick={renderMap}
                    >
                        Start Navigation
                    </button>
                </div>

                <div className={'mx-6'}>
                    <h3 className={'text-xl invisible'}>Alerts:</h3>
                    <button
                        className={'bg-amber-500 hover:bg-amber-600 text-white font-medium rounded p-4 border-2 border-amber-600'}
                        onClick={() => setShowAlerts(true)}
                    >
                        ⚠️ Weather Alerts
                    </button>
                </div>
            </div>

            {showMap && (
                <div className={'flex justify-center m-24'}>
                    <MyMap key={mapKey} startName={startLocation} endName={endLocation} />
                </div>
            )}

            {showAlerts && (
                <WeatherAlertComponent
                    defaultState="TX"
                    onClose={() => setShowAlerts(false)}
                />
            )}
        </div>
    );
}

export default Navigation;
