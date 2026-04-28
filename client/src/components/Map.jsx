import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

import {useEffect, useState} from "react";

function FitBounds({ lines }) {
    const map = useMap();
    useEffect(() => {
        if (!lines || lines.length === 0) return;
        const allCoords = lines.flat().map(coord => [coord[1], coord[0]]);
        if (allCoords.length > 0) {
            map.fitBounds(allCoords, { padding: [40, 40] });
        }
    }, [lines]);
    return null;
}

function MyMap({ startName, endName, onRouteCalculated }) {
    const startingPosition = [33.214587, -97.148325]; // Latitude, Longitude

    const [nodes, setNodes] = useState([]);
    const [lines, setLines] = useState([]);

    const routeInformation = {
        start: {
            abbreviation: startName
        },
        end: {
            abbreviation: endName
        }
    }

    const params = new URLSearchParams({
        start: routeInformation.start.abbreviation,
        end: routeInformation.end.abbreviation
    });

    useEffect(() => {
        fetch(`http://localhost:5001/api/nodes?${params.toString()}`, {
            method: "GET"
        })
            .then(res => res.json())
            .then(json => {
                setNodes(json.nodes);
                setLines(json.lines);
                if (onRouteCalculated && json.totalWeight !== undefined) {
                    onRouteCalculated(json.totalWeight);
                }
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
            {lines.length > 0 && <FitBounds lines={lines} />}
        </MapContainer>

    );
}

export default MyMap
