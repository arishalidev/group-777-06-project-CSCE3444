import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';

import {useEffect, useState} from "react";

function MyMap() {
    const startingPosition = [33.214587, -97.148325]; // Latitude, Longitude

    const [nodes, setNodes] = useState([]);
    const [lines, setLines] = useState([]);


    const routeInformation = {
        start: {
            abbreviation: "ART"
        },
        end: {
            abbreviation: "UU"
        }
    }

    const params = new URLSearchParams({
        start: routeInformation.start.abbreviation,
        end: routeInformation.end.abbreviation
    });

    useEffect(() => {
        fetch(`http://localhost:5001/api/nodes?${params.toString()}`, {
            method: "GET"
        })            .then(res => res.json())
            .then(json => {
                setNodes(json.nodes);
                setLines(json.lines);
            })
            .catch(err => {
                console.error(err);
            });
    } , []);

    const customDot = new L.divIcon({
        className: 'custom-div-icon',
        html: "<div style='background-color:darkblue; width:10px; height:10px; border-radius:50%;'></div>",
        iconSize: [10, 10],
        iconAnchor: [5, 5]
    });

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
                <Marker icon={customDot} key={node.properties.id} position={[node.geometry.coordinates[1], node.geometry.coordinates[0]]}
                />
            ))}

            {lines.map((line, index) => (
                <Polyline
                    key={index}
                    positions={line.map(coord => [coord[1], coord[0]])}
                    pathOptions={{ color: 'blue', weight: 5 }}
                />
            ))}
        </MapContainer>

    );
}

export default MyMap