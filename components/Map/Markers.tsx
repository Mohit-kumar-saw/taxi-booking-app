'use client'
import React, { useContext } from 'react'
import { Marker } from 'react-map-gl'
import { SourceCordiContext } from '@/context/SourceCordiContext'
import { DestinationCordiContext } from '@/context/DestinationCordiContext'
import { UserLocationContext } from "@/context/UserLocationContext";

// Validate coordinates
const isValidCoordinates = (lng?: number, lat?: number) => {
  return typeof lng === 'number' && 
         typeof lat === 'number' && 
         !isNaN(lng) && 
         !isNaN(lat) &&
         lng >= -180 && 
         lng <= 180 && 
         lat >= -90 && 
         lat <= 90;
};

function Markers() {
  const { userLocation, setUserLocation } = useContext(UserLocationContext);
  const { sourceCordinates } = useContext(SourceCordiContext)
  const { DestinationCordinates } = useContext(DestinationCordiContext)

  return (
    <>
      {/* User Location Marker */}
      {userLocation && isValidCoordinates(userLocation.lng, userLocation.lat) && (
        <Marker
          longitude={userLocation.lng}
          latitude={userLocation.lat}
          anchor="bottom"
        >
          <img src="/location.png" width={"60px"} />
        </Marker>
      )}

      {/* Source Marker */}
      {sourceCordinates && (
        <Marker
          longitude={sourceCordinates.lng}
          latitude={sourceCordinates.lat}
          anchor="bottom"
        >
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-8 h-8">
              <div className="absolute w-full h-full bg-blue-500/20 rounded-full animate-ping" />
              <div className="absolute w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </Marker>
      )}

      {/* Destination Marker */}
      {DestinationCordinates && (
        <Marker
          longitude={DestinationCordinates.lng}
          latitude={DestinationCordinates.lat}
          anchor="bottom"
        >
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-8 h-8">
              <div className="absolute w-full h-full bg-red-500/20 rounded-full animate-ping" />
              <div className="absolute w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </Marker>
      )}
    </>
  )
}

export default Markers
