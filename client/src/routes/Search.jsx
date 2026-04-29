import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Search() {
    const [searchTerm, setSearchTerm] = useState("");
    const [buildings, setBuildings] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5001/get/buildings')
            .then(res => res.json())
            .then(json => setBuildings(Array.isArray(json) ? json : json.buildings ?? []))
            .catch(err => {
                setBuildings([]);
                console.error(err);
            });
    }, []);

    const filtered = searchTerm.trim()
        ? buildings
            .filter((b) =>
                b.name?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice(0, 3)
        : [];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="py-20 text-center px-6">
                <h1 className="text-5xl font-bold text-gray-900 mb-3">Search</h1>
                <p className="text-gray-500 text-lg">Find buildings and destinations on campus</p>
            </div>

            <div className="max-w-3xl mx-auto px-6 pb-20">
                <input
                    type="text"
                    placeholder="Search buildings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-600"
                />

                <div className="space-y-3">
                    {filtered.map((building) => (
                        <div key={building._id} className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                            <img
                                src={`/images/${building.abbreviation}.jpg`}
                                alt={building.name}
                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <h2 className="text-base font-semibold text-gray-900 truncate">{building.name}</h2>
                                {building.description && (
                                    <p className="text-sm text-gray-500 truncate">{building.description}</p>
                                )}
                                {building.address && (
                                    <p className="text-xs text-gray-400 truncate">{building.address}</p>
                                )}
                            </div>
                            <Link
                                to="/navigation"
                                state={{ endLocation: building.abbreviation }}
                                className="flex-shrink-0 text-sm font-medium text-white px-4 py-2 rounded-lg"
                                style={{ backgroundColor: '#00853E' }}
                            >
                                Navigate →
                            </Link>
                        </div>
                    ))}

                    {searchTerm.trim() && filtered.length === 0 && (
                        <p className="text-center text-gray-400 py-12">No buildings found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Search;