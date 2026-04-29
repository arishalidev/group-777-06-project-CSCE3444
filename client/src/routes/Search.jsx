import Navbar from "../components/Navbar.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [buildings, setBuildings] = useState([]);

  const navigate = useNavigate();

  // Fetch buildings from backend
  useEffect(() => {
    fetch("http://localhost:5001/get/buildings")
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA:", data);
        setBuildings(data.buildings);
      })
      .catch((err) => console.error(err));
  }, []);

  // Filter buildings based on search
  const filtered = buildings.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar />

      <div className="py-24">
        <h1 className="text-6xl text-center pb-12">Search Page</h1>

        <div className="max-w-2xl mx-auto px-4">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6"
          />

          {/* Results */}
          <div className="space-y-4">
            {filtered.map((item) => (
              <div
                key={item._id || item.name}
                onClick={() =>
                  navigate("/navigation", {
                    state: {
                      endLocation: item.abbreviation, // 🔥 important
                    },
                  })
                }
                className="border border-gray-200 rounded-lg p-4 shadow-sm cursor-pointer hover:bg-gray-100"
              >
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-gray-600">{item.address}</p>
              </div>
            ))}

            {/* No results */}
            {filtered.length === 0 && (
              <p className="text-center text-gray-500">No result found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;