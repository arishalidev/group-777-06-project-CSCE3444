import Navbar from "../components/Navbar.jsx";
import MyMap from "../components/Map.jsx";
import WeatherAlertComponent from "../components/WeatherAlertComponent.jsx";
import HazardReportModal from "../components/HazardReportComponent.jsx";
import {useEffect, useState} from "react";

function Navigation() {

    const [startLocation, setStartLocation] = useState("");
    const [endLocation, setEndLocation] = useState("");
    const [showMap, setShowMap] = useState(false);
    const [mapKey, setMapKey] = useState(0);
    const [showAlerts, setShowAlerts] = useState(false);
    const [showHazardReport, setShowHazardReport] = useState(false);

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

    return (
        <div>
            <Navbar />
            <div className={'py-24'}>
                <h1 className={'text-6xl text-center'}>Navigation Page</h1>
            </div>

            <div className={'flex justify-center m-12'}>
                <div className={'mx-6'}>
                    <label htmlFor="start-location" className={'text-xl block'}>📍 Start Location:</label>
                    <select
                        id="start-location"
                        className={'border-2 rounded-md p-4 appearance-none'}
                        value={startLocation}
                        onChange={(e) => setStartLocation(e.target.value)}
                    >
                        <option value="" disabled>Select a building</option>
                        {buildings.map((building) => (
                            <option key={building.abbreviation} value={building.abbreviation}>
                                {building.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={'mx-6'}>
                    <label htmlFor="end-location" className={'text-xl block'}>🏁 End Location:</label>
                    <select
                        id="end-location"
                        className={'border-2 rounded-md p-4'}
                        value={endLocation}
                        onChange={(e) => setEndLocation(e.target.value)}
                    >
                        <option value="" disabled>Select a building</option>
                        {buildings.map((building) => (
                            <option key={building.abbreviation} value={building.abbreviation}>
                                {building.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={'mx-6'}>
                    <h2 className={'text-xl invisible'}>Actions</h2>
                    <button
                        className={'bg-green-500 rounded p-4 hover:bg-green-600 border-2'}
                        onClick={renderMap}
                    >
                        🧭 Start Navigation
                    </button>
                </div>

                <div className={'mx-6'}>
                    <button
                        className={'bg-amber-500 hover:bg-amber-600 text-white font-medium rounded p-4 border-2 border-amber-600 mt-9'}
                        onClick={() => setShowAlerts(true)}
                    >
                        ⚠️ Weather Alerts
                    </button>
                </div>

                <div className={'mx-6'}>
                    <button
                        className={'bg-red-500 hover:bg-red-600 text-white font-medium rounded p-4 border-2 border-red-600 mt-9'}
                        onClick={() => setShowHazardReport(true)}
                    >
                        🚨 Report Hazard
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

            {showHazardReport && (
                <HazardReportModal
                    onClose={() => setShowHazardReport(false)}
                />
            )}
        </div>
    );
}

export default Navigation;
