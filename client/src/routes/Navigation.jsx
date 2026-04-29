import Navbar from "../components/Navbar.jsx";
import MyMap from "../components/Map.jsx";
import WeatherAlertComponent from "../components/WeatherAlertComponent.jsx";
import HazardReportModal from "../components/HazardReportComponent.jsx";
import HazardViewModal from "../components/HazardViewComponent.jsx";
import {useEffect, useRef, useState} from "react";
import {useLocation} from "react-router-dom";

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

function ETACard({ distanceMeters, vehicleId, startLabel, endLabel }) {
    const vehicle = VEHICLE_TYPES.find(v => v.id === vehicleId);
    const seconds = distanceMeters / vehicle.speedMs;
    const distanceKm = (distanceMeters / 1000).toFixed(2);

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-8 py-4 mb-6 w-full max-w-2xl">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-700 mb-3 pb-3 border-b border-gray-100">
                <div className="text-center">
                <span className="font-medium truncate">📍 {startLabel}</span>
                <span className="text-gray-300 flex-shrink-0">→</span>
                <span className="font-medium truncate">🏁 {endLabel}</span>
                </div>
            </div>
            <div className="flex items-center justify-center gap-6">
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
        </div>
    );
}

function Navigation() {

    const { state } = useLocation();
    const [startLocation, setStartLocation] = useState("");
    const [endLocation, setEndLocation] = useState(state?.endLocation ?? "");
    const [vehicleId, setVehicleId] = useState("walk");
    const [showMap, setShowMap] = useState(false);
    const [mapKey, setMapKey] = useState(0);
    const [showAlerts, setShowAlerts] = useState(false);
    const [showHazardReport, setShowHazardReport] = useState(false);
    const [showHazardView, setShowHazardView] = useState(false);
    const [errors, setErrors] = useState({ start: false, end: false });
    const [totalWeight, setTotalWeight] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        if (showMap && mapRef.current) {
            mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [mapKey]);

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

            <div className={'flex flex-col items-center gap-4 mx-12 mb-12'}>
                {/* Navigation controls row */}
                <div className={'flex justify-center flex-wrap gap-6'}>
                    <div>
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

                    <div>
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

                    <div>
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

                    <div className={'flex items-end'}>
                        <button
                            className={'bg-green-500 rounded p-4 hover:bg-green-600 border-2'}
                            onClick={renderMap}
                        >
                            🧭 Start Navigation
                        </button>
                    </div>
                </div>

                {/* Action buttons row */}
                <div className={'flex justify-center gap-4'}>
                    <button
                        className={'bg-amber-500 hover:bg-amber-600 text-white font-medium rounded p-3 border-2 border-amber-600'}
                        onClick={() => setShowAlerts(true)}
                    >
                        ⚠️ Weather Alerts
                    </button>
                    <button
                        className={'bg-red-500 hover:bg-red-600 text-white font-medium rounded p-3 border-2 border-red-600'}
                        onClick={() => setShowHazardReport(true)}
                    >
                        🚨 Report Hazard
                    </button>
                    <button
                        className={'bg-orange-500 hover:bg-orange-600 text-white font-medium rounded p-3 border-2 border-orange-600'}
                        onClick={() => setShowHazardView(true)}
                    >
                        🛡️ View Hazards
                    </button>
                </div>
            </div>

            {showMap && (
                <div ref={mapRef} className={'flex flex-col items-center mx-12 mb-12'}>
                    {totalWeight !== null && (
                        <ETACard
                            distanceMeters={totalWeight}
                            vehicleId={vehicleId}
                            startLabel={buildings.find(b => b.abbreviation === startLocation)?.name || startLocation}
                            endLabel={buildings.find(b => b.abbreviation === endLocation)?.name || endLocation}
                        />
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

            {showHazardView && (
                <HazardViewModal
                    onClose={() => setShowHazardView(false)}
                />
            )}
        </div>
    );
}

export default Navigation;
