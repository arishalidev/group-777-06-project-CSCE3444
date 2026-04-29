import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router-dom";
import {useEffect, useState} from "react";

function Home() {

    const [buildings, setBuildings] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5001/get/buildings')
            .then(res => res.json())
            .then(json => setBuildings(Array.isArray(json) ? json : json.buildings ?? []))
                .catch(err =>  {
                setBuildings([]);
                console.error(err);
            });
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero */}
            <div className="py-20 text-center px-6">
                <h1 className="text-5xl font-bold text-gray-900 mb-3">Where to?</h1>
                <p className="text-gray-500 text-lg">Popular destinations on campus</p>
            </div>

            {/* Building cards */}
            <div className="max-w-6xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {buildings.filter(b => b.popular === true).map((building) => (
                        <div key={building._id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                            <img
                                src={`/images/${building.abbreviation}.jpg`}
                                alt={building.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-5 flex flex-col flex-1">
                                <h2 className="text-lg font-semibold text-gray-900 mb-1">{building.name}</h2>
                                {building.description && (
                                    <p className="text-sm text-gray-500 mb-1">{building.description}</p>
                                )}
                                {building.address && (
                                    <p className="text-xs text-gray-400 mb-4">{building.address}</p>
                                )}
                                <div className="mt-auto">
                                    <Link
                                        to="/navigation"
                                        state={{ endLocation: building.abbreviation }}
                                        className="inline-block text-sm font-medium text-white px-4 py-2 rounded-lg"
                                        style={{ backgroundColor: '#00853E' }}
                                    >
                                        Navigate →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Home