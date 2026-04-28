import Navbar from "../components/Navbar.jsx";
import MyMap from "../components/Map.jsx";
import WeatherAlertComponent from "../components/WeatherAlertComponent.jsx";
import HazardReportModal from "../components/HazardReportComponent.jsx";
import {useEffect, useState} from "react";

const VEHICLE_TYPES = [
    { id: "walk",    label: "Walk",             emoji: "🚶", speedMs: 1.4 },
    { id: "bicycle", label: "Bicycle",          emoji: "🚲", speedMs: 4.5 },
    { id: "scooter", label: "Electric Scooter", emoji: "🛴", speedMs: 6.7 },
];

function formatETA(seconds) {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    if (mins < 60) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return remMins > 0 ? `${hrs}h ${remMins}m` : `${hrs}h`;
}

function ETACard({ distanceMeters, vehicleId }) {
    const vehicle = VEHICLE_TYPES.find(v => v.id === vehicleId);
    const seconds = distanceMeters / vehicle.speedMs;
    const distanceKm = (distanceMeters / 1000).toFixed(2);

    return (
        <div className="flex items-center justify-center gap-6 bg-white border border-gray-200 rounded-2xl shadow-sm px-8 py-4 mb-6">
            <div className="text-center">
                <p className="text-xs text-gray-400 mb-0.5">Vehicle</p>
                <p className="text-sm font-medium text-gray-800">{vehicle.emoji} {vehicle.label}</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
                <p className="text-xs text-gray-400 mb-0.5">Distance</p>
                <p className="text-sm font-medium text-gray-800">{distanceKm} km</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
                <p className="text-xs text-gray-400 mb-0.5">Estimated Time</p>
                <p className="text-lg font-semibold text-green-600">{formatETA(seconds)}</p>
            </div>
        </div>
    );
}

function Navigation() {

    const [startLocation, setStartLocation] = useState("");
    const [endLocation, setEndLocation] = useState("");
    const [vehicleId, setVehicleId] = useState("walk");
    const [showMap, setShowMap] = useState(false);
    const [mapKey, setMapKey] = useState(0);
    const [showAlerts, setShowAlerts] = useState(false);
    const [showHazardReport, setShowHazardReport] = useState(false);
    const [errors, setErrors] = useState({ start: false, end: false });
    const [totalWeight, setTotalWeight] = useState(null);

    function renderMap() {
        const newErrors = { start: !startLocation, end: !endLocation };
        setErrors(newErrors);
        if (newErrors.start || newErrors.end) return;
        setTotalWeight(null);
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
                        className={'border-2 rounded-md p-4'}
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
                    {errors.start && <p className="text-red-500 text-sm mt-1">Please select a start location.</p>}
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
                    {errors.end && <p className="text-red-500 text-sm mt-1">Please select an end location.</p>}
                </div>

                <div className={'mx-6'}>
                    <label htmlFor="vehicle-type" className={'text-xl block'}>🚗 Vehicle Type:</label>
                    <select
                        id="vehicle-type"
                        className={'border-2 rounded-md p-4'}
                        value={vehicleId}
                        onChange={(e) => setVehicleId(e.target.value)}
                    >
                        {VEHICLE_TYPES.map(v => (
                            <option key={v.id} value={v.id}>
                                {v.emoji} {v.label}
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
                <div className={'flex flex-col items-center m-24'}>
                    {totalWeight !== null && (
                        <ETACard distanceMeters={totalWeight} vehicleId={vehicleId} />
                    )}
                    <MyMap
                        key={mapKey}
                        startName={startLocation}
                        endName={endLocation}
                        onRouteCalculated={(weight) => setTotalWeight(weight)}
                    />
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
