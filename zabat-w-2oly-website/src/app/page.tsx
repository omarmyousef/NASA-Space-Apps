"use client"

import React from 'react'
import Map from './_components/Map'
import { MapProvider } from 'react-map-gl/mapbox'

const Home = () => {
  return (
    <MapProvider>
        
        <Map />
    </MapProvider>
  )
}

export default Home