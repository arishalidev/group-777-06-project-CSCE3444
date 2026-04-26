import Navbar from "../components/Navbar.jsx";
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
        <div>
            <Navbar></Navbar>
            <div className={'py-24'}>
                <h1 className={'text-6xl text-center pb-12'}>Where to?</h1>
                <div className={"grid grid-cols-3 mx-25 gap-12"}>
                    {buildings.map((building) => (
                        <div key={building._id} className={"bg-gray-100 rounded-xl"}>
                            <div className={"mx-12 my-4"}>
                                <h2 className={"text-center text-xl m-2"}>{building.name}</h2>
                                <span className={"text-xl"}>{building.description}</span>
                                <br/>
                                <span className={"text-xl"}>{building.address}</span>
                                <img src={`/images/${building.abbreviation}.jpg`} alt={building.name}/>
                            </div>
                        </div>
                ))}
                </div>
            </div>
        </div>
    )
}

export default Home