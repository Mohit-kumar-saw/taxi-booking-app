'use client'
import React, { useEffect, useState, useContext, useRef } from 'react'
import { SourceCordiContext } from "@/context/SourceCordiContext"
import { DestinationCordiContext } from "@/context/DestinationCordiContext"

const MAPBOX_GEOCODING_API = "https://api.mapbox.com/geocoding/v5/mapbox.places"
const INDIA_BOUNDS = "68.1766451354,7.96553477623,97.4025614766,35.4940095078"

export default function AutocompleteAddress() {
  const [source, setSource] = useState('')
  const [destination, setDestination] = useState('')
  const [sourceList, setSourceList] = useState<any[]>([])
  const [destinationList, setDestinationList] = useState<any[]>([])
  const [showSourceList, setShowSourceList] = useState(false)
  const [showDestinationList, setShowDestinationList] = useState(false)
  
  const sourceRef = useRef<HTMLDivElement>(null)
  const destinationRef = useRef<HTMLDivElement>(null)
  
  const { setSourceCordinates } = useContext(SourceCordiContext)
  const { setDestinationCordinates } = useContext(DestinationCordiContext)

  // Handle clicks outside of dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sourceRef.current && !sourceRef.current.contains(event.target as Node)) {
        setShowSourceList(false)
      }
      if (destinationRef.current && !destinationRef.current.contains(event.target as Node)) {
        setShowDestinationList(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Source location search
  useEffect(() => {
    const getSourceResults = async () => {
      if (!source.trim()) {
        setSourceList([])
        return
      }

      try {
        const res = await fetch(
          `${MAPBOX_GEOCODING_API}/${encodeURIComponent(source)}.json?` + 
          new URLSearchParams({
            access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '',
            country: 'in',
            bbox: INDIA_BOUNDS,
            limit: '5',
            types: 'place,locality,neighborhood,address,poi',
            language: 'en'
          })
        )
        const data = await res.json()
        setSourceList(data.features || [])
      } catch (error) {
        console.error('Error fetching source locations:', error)
        setSourceList([])
      }
    }

    const timer = setTimeout(getSourceResults, 300)
    return () => clearTimeout(timer)
  }, [source])

  // Destination location search
  useEffect(() => {
    const getDestinationResults = async () => {
      if (!destination.trim()) {
        setDestinationList([])
        return
      }

      try {
        const res = await fetch(
          `${MAPBOX_GEOCODING_API}/${encodeURIComponent(destination)}.json?` + 
          new URLSearchParams({
            access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '',
            country: 'in',
            bbox: INDIA_BOUNDS,
            limit: '5',
            types: 'place,locality,neighborhood,address,poi',
            language: 'en'
          })
        )
        const data = await res.json()
        setDestinationList(data.features || [])
      } catch (error) {
        console.error('Error fetching destination locations:', error)
        setDestinationList([])
      }
    }

    const timer = setTimeout(getDestinationResults, 300)
    return () => clearTimeout(timer)
  }, [destination])

  const handleSourceSelect = (item: any) => {
    setSource(item.place_name)
    setSourceList([])
    setShowSourceList(false)
    setSourceCordinates({
      lng: item.center[0],
      lat: item.center[1]
    })
  }

  const handleDestinationSelect = (item: any) => {
    setDestination(item.place_name)
    setDestinationList([])
    setShowDestinationList(false)
    setDestinationCordinates({
      lng: item.center[0],
      lat: item.center[1]
    })
  }

  return (
    <div className="space-y-3">
      {/* Source Input */}
      <div ref={sourceRef} className="relative">
        <label className="text-gray-400 text-[13px]">Pickup Location</label>
        <input
          type="text"
          value={source}
          onChange={(e) => {
            setSource(e.target.value)
            setShowSourceList(true)
          }}
          onFocus={() => setShowSourceList(true)}
          placeholder="Enter pickup location"
          className="bg-white p-1 border-[1px] w-full rounded-md outline-none focus:border-yellow-300 text-[14px]"
        />
        
        {showSourceList && sourceList.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-[200px] overflow-y-auto">
            {sourceList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleSourceSelect(item)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[14px]"
              >
                {item.place_name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Destination Input */}
      <div ref={destinationRef} className="relative">
        <label className="text-gray-400 text-[13px]">Drop Location</label>
        <input
          type="text"
          value={destination}
          onChange={(e) => {
            setDestination(e.target.value)
            setShowDestinationList(true)
          }}
          onFocus={() => setShowDestinationList(true)}
          placeholder="Enter drop location"
          className="bg-white p-1 border-[1px] w-full rounded-md outline-none focus:border-yellow-300 text-[14px]"
        />
        
        {showDestinationList && destinationList.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-[200px] overflow-y-auto">
            {destinationList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleDestinationSelect(item)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[14px]"
              >
                {item.place_name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
