"use client"

import * as React from 'react';
import { Map as ReactMap, Marker, useMap, MapProvider } from 'react-map-gl/mapbox';
import Pin from './Pin';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = () => {
    const { default: map } = useMap();

    const [markerLocation, setMarkerLocation] = React.useState({
        latitude: 31.233334,
        longitude: 30.033333
    });

    const handleMapClick = (event: any) => {
        const lng = event.lngLat.lng;
        const lat = event.lngLat.lat;

        console.log('Map clicked at:', lng, lat);

        setMarkerLocation({ longitude: lng, latitude: lat });

        map?.flyTo({
            center: [lng, lat],
            zoom: 10,
            speed: 0.3,
        });
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
                onClick={e => {
                    alert("Marker Clicked")
                }}
            >
                <Pin open={true} popoverContent={
                    <>Hello World</>
                } />
            </Marker>
        </ReactMap>
    );
}

export default Map;
