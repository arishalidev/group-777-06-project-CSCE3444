import Navbar from "../components/Navbar.jsx";
import { useState } from "react";

function Search() {
    const [searchTerm, setSearchTerm] = useState("");

    const sampleResults = [
        { id: 1, name: "Discovery Park", desc: "Engineering and CS buildings" },
        { id: 2, name: "Willis Library", desc: "Main library for studying" },
        { id: 3, name: "University Union", desc: "Food court and student center" }
    ];

    const filtered = sampleResults.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
     <div>
        <Navbar></Navbar>

        <div className={'py-24'}>
            <h1 className= {'text-6xl text-center pb-12'}>Search Page</h1>

            <div className="max-w-2xl mx-auto px-4">
                <input
                 type="text"
                 placeholder="Search..."
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6"
             />
            
             <div className="space-y-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <h2 className="text-x1 font-semibold">{item.name}</h2>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}

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