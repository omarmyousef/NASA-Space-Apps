"use client"

import * as React from 'react';
import { Map as ReactMap, Marker, useMap } from 'react-map-gl/mapbox';
import Pin from './Pin';
import 'mapbox-gl/dist/mapbox-gl.css';
import MarkerPopover from "./MarkerPopover";

export interface markerLocationType {
    latitude: number;
    longitude: number;
}

const Map = () => {
    const { default: map } = useMap();

    const [markerLocation, setMarkerLocation] = React.useState<markerLocationType>({
        latitude: 31.233334,
        longitude: 30.033333
    });

    const [flying, setFlying] = React.useState(false);

    const handleMapClick = (event: any) => {
        const lng = event.lngLat.lng;
        const lat = event.lngLat.lat;

        console.log('Map clicked at:', lng, lat);

        setMarkerLocation({ longitude: lng, latitude: lat });

        if (map) {
            setFlying(true); // 🚀 start flying
            map.flyTo({
                center: [lng, lat],
                zoom: 10,
                speed: 0.3,
            });

            // 👂 Wait for animation end
            map.once("moveend", () => {
                setFlying(false);
            });
        }
    };

    return (
        <ReactMap
            mapboxAccessToken="pk.eyJ1Ijoib21hcm15b3VzZWYiLCJhIjoiY21nOWd1cG5iMDlpODJqcXQ2emJrMzZxMCJ9.AWjm1ukrIXcNrQlMXnadSw"
            onClick={handleMapClick}
            initialViewState={{
                longitude: markerLocation.longitude,
                latitude: markerLocation.latitude,
                zoom: 8
            }}
            style={{ width: "100vw", height: "100vh" }}
            mapStyle="mapbox://styles/mapbox/outdoors-v12"
        >
            <Marker
                key={`marker-main`}
                longitude={markerLocation.longitude}
                latitude={markerLocation.latitude}
                anchor="bottom"
            >
                <Pin
                    open={true}
                    flying={flying} // 👈 Pass flying state
                    popoverContent={<MarkerPopover markerLocation={markerLocation} />}
                />
            </Marker>
        </ReactMap>
    );
}

export default Map;
