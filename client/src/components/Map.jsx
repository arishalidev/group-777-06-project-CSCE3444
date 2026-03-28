import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {useEffect, useState} from "react";

function MyMap() {
    const position = [33.214587, -97.148325]; // Latitude, Longitude

    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5001/api/nodes/all')
            .then(res => res.json())
            .then(json => {
                setNodes(json.nodes)
                console.log(json.nodes)
            })
            .then(err => {
                console.error(err);
            });
    } , []);



    return (
        <MapContainer
            center={position}
            zoom={13}
            style={{ height: '400px', width: '80%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={position}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>

    );
}

export default MyMap