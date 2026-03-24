import { useState } from "react";

function Search() {
    const [searchTerm, setSearchTerm] = useState("");

    const sampleResults = [
        { id: 1, name: "Discovery Park", desc: "Engineering and CS buildings" },
        { id: 2, name: "Willis Library", desc: "Main library for srudying" },
        { id: 3, name: "University Union", desc: "Food court and student center" }
    ];

    const filtered = sampleResults.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
     <div>
        <h1>Search Page</h1>

        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchTerm(e.target.value)}
         />
            
            {filtered.map((item) => (
            <p key={item.id}>{item.name}</p>
            ))}
     </div>    
    );
}

export default Search;