import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {useEffect, useState} from "react";

function MyMap() {
    const startingPosition = [33.214587, -97.148325]; // Latitude, Longitude

    const [nodes, setNodes] = useState([]);

    console.log((nodes));
    useEffect(() => {
        fetch('http://localhost:5001/api/nodes/all')
            .then(res => res.json())
            .then(json => {
                setNodes(json.nodes)
            })
            .catch(err => {
                console.error(err);
            });
    } , []);

    return (
        <MapContainer
            center={startingPosition}
            zoom={13}
            style={{ height: '400px', width: '80%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

            {nodes.map((node) => (
                <Marker key={node._id} position={[node.geometry.coordinates[1], node.geometry.coordinates[0]]}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            ))}
        </MapContainer>

    );
}

export default MyMap