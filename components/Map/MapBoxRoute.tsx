'use client'
import React, { useMemo } from 'react'
import { Layer, Source } from 'react-map-gl'

interface MapBoxRouteProps {
  coordinates: [number, number][];
}

function MapBoxRoute({ coordinates }: MapBoxRouteProps) {
  // Memoize GeoJSON data to prevent unnecessary re-renders
  const geojson = useMemo(() => ({
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'LineString' as const,
      coordinates
    }
  }), [coordinates]);

  if (!coordinates || coordinates.length < 2) {
    return null;
  }

  return (
    <Source
      type="geojson"
      data={geojson}
    >
      {/* Route outline */}
      <Layer
        id="route-outline"
        type="line"
        layout={{
          'line-join': 'round',
          'line-cap': 'round',
          visibility: 'visible'
        }}
        paint={{
          'line-color': '#0462d4',
          'line-width': 6,
          'line-opacity': 0.4,
          'line-blur': 0.5
        }}
      />

      {/* Route line */}
      <Layer
        id="route-line"
        type="line"
        layout={{
          'line-join': 'round',
          'line-cap': 'round',
          visibility: 'visible'
        }}
        paint={{
          'line-color': '#0462d4',
          'line-width': 3,
          'line-opacity': 1
        }}
      />
    </Source>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default React.memo(MapBoxRoute);
