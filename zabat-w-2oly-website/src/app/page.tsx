"use client"

import React from 'react'
import Map from './_components/Map'
import { MapProvider } from 'react-map-gl/mapbox'
import LocationSearch from './_components/MapSearch'

const Home = () => {
  return (
    <MapProvider>
        
        <LocationSearch />
    </MapProvider>
  )
}

export default Home