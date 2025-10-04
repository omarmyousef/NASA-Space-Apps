"use client";

import React, { useState, useRef, useEffect } from "react";
import { Map as ReactMap, Marker, NavigationControl, useMap } from "react-map-gl/mapbox";
import { Search, MapPin, X } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import Pin from "./Pin";
import MarkerPopover from "./MarkerPopover";

const MAPBOX_TOKEN = "pk.eyJ1Ijoib21hcm15b3VzZWYiLCJhIjoiY21nOWd1cG5iMDlpODJqcXQ2emJrMzZxMCJ9.AWjm1ukrIXcNrQlMXnadSw";

interface SearchResult {
    id: string;
    place_name: string;
    center: [number, number];
    text: string;
}

export interface markerLocationType {
    latitude: number;
    longitude: number;
}

const MapSearch = () => {
    const { default: map } = useMap();

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<SearchResult | null>(null);

    const [markerLocation, setMarkerLocation] = useState<markerLocationType>({
        latitude: 31.233334,
        longitude: 30.033333,
    });

    const [flying, setFlying] = useState(false);

    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Search for locations using Mapbox Geocoding API
    const searchLocations = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                    query
                )}.json?access_token=${MAPBOX_TOKEN}&types=place,address,locality,neighborhood,poi&limit=5&proximity=${markerLocation.longitude},${markerLocation.latitude}&fuzzyMatch=true`
            );
            const data = await response.json();
            setSearchResults(data.features || []);
            setShowResults(true);
        } catch (error) {
            setSearchResults([]);
        }
    };

    // Debounced search
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = setTimeout(() => {
            searchLocations(value);
        }, 300);
    };

    // Handle location selection from search
    const handleLocationSelect = (result: SearchResult) => {
        setSelectedLocation(result);
        setSearchQuery(result.place_name);
        setShowResults(false);

        setMarkerLocation({
            longitude: result.center[0],
            latitude: result.center[1],
        });

        if (map) {
            setFlying(true);
            map.flyTo({
                center: result.center,
                // zoom: 14,
                speed: 0.3,
            });
            map.once("moveend", () => setFlying(false));
        }
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchQuery("");
        setSearchResults([]);
        setSelectedLocation(null);
        setShowResults(false);
    };

    // Handle map click to set marker
    const handleMapClick = (event: any) => {
        const lng = event.lngLat.lng;
        const lat = event.lngLat.lat;
        setMarkerLocation({ longitude: lng, latitude: lat });
        setSelectedLocation(null);

        if (map) {
            setFlying(true);
            map.flyTo({
                center: [lng, lat],
                // zoom: 10,
                speed: 0.3,
            });
            map.once("moveend", () => setFlying(false));
        }
    };

    return (
        <div className="w-full h-screen flex flex-col">
            {/* Search Bar */}
            <div className="absolute top-4 left-4 right-4 z-10 max-w-md" ref={searchRef}>
                <div className="relative">
                    <div className="flex items-center bg-white rounded-lg shadow-lg border border-gray-200" dir="auto">
                        <Search className="ml-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onFocus={() => searchResults.length > 0 && setShowResults(true)}
                            placeholder="Search for a location..."
                            className="flex-1 px-3 py-3 rounded-lg focus:outline-none"
                            dir="auto"
                            style={
                                {
                                    "direction": "ltr"
                                }
                            }
                        />
                        {searchQuery && (
                            <button
                                onClick={handleClearSearch}
                                className="mr-3 text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                    {/* Search Results Dropdown */}
                    {showResults && searchResults.length > 0 && (
                        <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto">
                            {searchResults.map((result) => (
                                <button
                                    key={result.id}
                                    onClick={() => handleLocationSelect(result)}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start gap-3 border-b border-gray-100 last:border-b-0"
                                >
                                    <MapPin className="text-red-500 flex-shrink-0 mt-1" size={18} />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900 truncate">{result.text}</div>
                                        <div className="text-sm text-gray-500 truncate">{result.place_name}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Selected Location Info */}
            {selectedLocation && (
                <div className="absolute bottom-4 left-4 right-4 z-10 max-w-md mx-auto">
                    <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
                        <div className="flex items-start gap-3">
                            <MapPin className="text-red-500 flex-shrink-0 mt-1" size={20} />
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900">{selectedLocation.text}</div>
                                <div className="text-sm text-gray-600 mt-1">{selectedLocation.place_name}</div>
                                <div className="text-xs text-gray-500 mt-2">
                                    {selectedLocation.center[1].toFixed(6)}, {selectedLocation.center[0].toFixed(6)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Map */}
            <ReactMap
                mapboxAccessToken={MAPBOX_TOKEN}
                onClick={handleMapClick}
                initialViewState={{
                    longitude: markerLocation.longitude,
                    latitude: markerLocation.latitude,
                    zoom: 8,
                }}
                style={{ width: "100vw", height: "100vh" }}
                mapStyle="mapbox://styles/mapbox/outdoors-v12"
            >
                <NavigationControl position="top-right" />
                <Marker
                    key={`marker-main`}
                    longitude={markerLocation.longitude}
                    latitude={markerLocation.latitude}
                    anchor="bottom"
                >
                    <Pin
                        open={true}
                        flying={flying}
                        popoverContent={<MarkerPopover markerLocation={markerLocation} />}
                    />
                </Marker>
            </ReactMap>
        </div>
    );
};

export default MapSearch;