'use client'
import React, { useEffect, useRef, useContext, useMemo } from 'react'
import { Map } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import Markers from './Markers';
import { SourceCordiContext } from '@/context/SourceCordiContext';
import { DestinationCordiContext } from '@/context/DestinationCordiContext';
import { DirectionDataContext } from '@/context/DirectionDataContext';
import MapBoxRoute from './MapBoxRoute';
import DistanceTime from './DistanceTime';

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

// Initial map center (India)
const INITIAL_VIEW_STATE = {
  longitude: 78.9629,
  latitude: 20.5937,
  zoom: 4
};

// Map style optimization
const MAP_STYLE = {
  version: 8,
  sources: {},
  layers: [],
  glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
  sprite: 'mapbox://sprites/mapbox/streets-v11'
};

export default function MapBox() {
  const mapRef = useRef<any>();
  const { sourceCordinates } = useContext(SourceCordiContext);
  const { DestinationCordinates } = useContext(DestinationCordiContext);
  const { directionData, setDirectionData } = useContext(DirectionDataContext);

  // Memoize map style to prevent unnecessary re-renders
  const mapStyle = useMemo(() => ({
    ...MAP_STYLE,
    sources: {
      ...MAP_STYLE.sources,
      'mapbox-streets': {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-streets-v8'
      }
    },
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: {
          'background-color': '#ffffff'
        }
      },
      {
        id: 'road-network',
        type: 'line',
        source: 'mapbox-streets',
        'source-layer': 'road',
        paint: {
          'line-color': '#ddd',
          'line-width': 1
        }
      }
    ]
  }), []);

  // Debounce route calculation
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const calculateRoute = async () => {
      if (!sourceCordinates || !DestinationCordinates || !MAPBOX_ACCESS_TOKEN) {
        return;
      }

      try {
        const res = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${sourceCordinates.lng},${sourceCordinates.lat};${DestinationCordinates.lng},${DestinationCordinates.lat}?steps=true&geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`
        );

        if (!res.ok) {
          throw new Error('Failed to fetch route');
        }

        const data = await res.json();

        if (data.code === "Ok" && data.routes?.[0]) {
          const route = data.routes[0];
          setDirectionData({
            routes: [{
              geometry: route.geometry,
              distance: route.distance,
              duration: route.duration
            }],
            code: data.code
          });

          // Smooth camera transition
          if (mapRef.current && route.geometry.coordinates.length > 0) {
            const coordinates = route.geometry.coordinates;
            const bounds = coordinates.reduce(
              (bounds: any, coord: number[]) => ({
                ne: {
                  lat: Math.max(bounds.ne.lat, coord[1]),
                  lng: Math.max(bounds.ne.lng, coord[0])
                },
                sw: {
                  lat: Math.min(bounds.sw.lat, coord[1]),
                  lng: Math.min(bounds.sw.lng, coord[0])
                }
              }),
              {
                ne: { lat: -90, lng: -180 },
                sw: { lat: 90, lng: 180 }
              }
            );

            mapRef.current.fitBounds(
              [
                [bounds.sw.lng, bounds.sw.lat],
                [bounds.ne.lng, bounds.ne.lat]
              ],
              {
                padding: 100,
                duration: 1000,
                essential: true
              }
            );
          }
        }
      } catch (error) {
        console.error('Error calculating route:', error);
      }
    };

    // Debounce route calculation
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(calculateRoute, 300);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [sourceCordinates, DestinationCordinates, setDirectionData]);

  return (
    <div className='p-5'>
      <h2 className='text-[20px] font-semibold'>Map</h2>
      <div className='rounded-lg overflow-hidden relative'>
        <Map
          ref={mapRef}
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          initialViewState={INITIAL_VIEW_STATE}
          style={{ width: '100%', height: 450, borderRadius: 10 }}
          mapStyle='mapbox://styles/mapbox/streets-v12'
          attributionControl={false}
          renderWorldCopies={false} // Improves performance
          optimizeForTerrain={false} // Improves performance
          maxZoom={16} // Limit zoom to improve performance
        >
          <Markers />
          {directionData?.routes?.[0]?.geometry?.coordinates && (
            <MapBoxRoute 
              coordinates={directionData.routes[0].geometry.coordinates} 
            />
          )}
        </Map>
        
        {directionData?.routes?.[0] && (
          <div className="absolute bottom-0 right-0 p-4 bg-white dark:bg-gray-800 rounded-tl-lg shadow-lg">
            <DistanceTime route={directionData.routes[0]} />
          </div>
        )}
      </div>
    </div>
  );
}
